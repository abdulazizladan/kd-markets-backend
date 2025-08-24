import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity, ActivityStatus, ActivityFrequency } from './entities/activity.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activitiesRepository: Repository<Activity>,
  ) {}

  async testRepository(): Promise<{ message: string; working: boolean }> {
    try {
      console.log('Testing repository connection...');
      
      // Test basic repository operations
      const count = await this.activitiesRepository.count();
      console.log('Current record count:', count);
      
      // Test if we can create a simple entity
      const testEntity = this.activitiesRepository.create({
        name: 'Test',
        description: 'Test Description',
        scheduledTime: new Date(),
        frequency: ActivityFrequency.Daily,
        status: ActivityStatus.Planned,
        lastCompleted: new Date()
      });
      
      console.log('Test entity created:', testEntity);
      
      return {
        message: 'Repository is working correctly',
        working: true
      };
    } catch (error) {
      console.error('Repository test failed:', error);
      return {
        message: 'Repository test failed: ' + error.message,
        working: false
      };
    }
  }

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    try {
      console.log('Creating activity with DTO:', JSON.stringify(createActivityDto, null, 2));
      
      // Validate required fields
      if (!createActivityDto.name || !createActivityDto.description || !createActivityDto.scheduledTime || !createActivityDto.frequency) {
        throw new BadRequestException('Missing required fields: name, description, scheduledTime, and frequency are required');
      }
      
      // Set default values for required fields if not provided
      const activityData = {
        ...createActivityDto,
        status: createActivityDto.status || ActivityStatus.Planned // Default status
      };
      
      console.log('Processed activity data:', JSON.stringify(activityData, null, 2));
      
      // Validate the data before creating
      if (!activityData.name || !activityData.description || !activityData.scheduledTime || !activityData.frequency || !activityData.lastCompleted || !activityData.status) {
        throw new BadRequestException('Invalid activity data after processing');
      }
      
      const activity = this.activitiesRepository.create(activityData);
      console.log('Created activity entity:', JSON.stringify(activity, null, 2));
      
      const savedActivity = await this.activitiesRepository.save(activity);
      console.log('Saved activity result:', JSON.stringify(savedActivity, null, 2));
      
      if (!savedActivity) {
        throw new InternalServerErrorException('Failed to create activity');
      }
      
      return savedActivity;
    } catch (error) {
      console.error('Error creating activity:', error);
      console.error('Error stack:', error.stack);
      
      if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
        throw error;
      }
      
      if (error.code === 'SQLITE_CONSTRAINT') {
        throw new BadRequestException('Activity with this name already exists');
      }
      
      throw new InternalServerErrorException('Failed to create activity: ' + error.message);
    }
  }

  async findAll(): Promise<Activity[]> {
    try {
      const activities = await this.activitiesRepository.find({
        order: {
          scheduledTime: 'ASC'
        }
      });
      
      return activities;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch activities: ' + error.message);
    }
  }

  async findOne(id: string): Promise<Activity> {
    try {
      if (!id) {
        throw new BadRequestException('Activity ID is required');
      }

      const activity = await this.activitiesRepository.findOne({
        where: { id }
      });

      if (!activity) {
        throw new NotFoundException(`Activity with ID ${id} not found`);
      }

      return activity;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to fetch activity: ' + error.message);
    }
  }

  async update(id: string, updateActivityDto: UpdateActivityDto): Promise<Activity> {
    try {
      if (!id) {
        throw new BadRequestException('Activity ID is required');
      }

      // Check if activity exists
      const existingActivity = await this.findOne(id);
      
      // Update the activity
      const updatedActivity = await this.activitiesRepository.save({
        ...existingActivity,
        ...updateActivityDto
      });

      if (!updatedActivity) {
        throw new InternalServerErrorException('Failed to update activity');
      }

      return updatedActivity;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      
      if (error.code === 'SQLITE_CONSTRAINT') {
        throw new BadRequestException('Activity with this name already exists');
      }
      
      throw new InternalServerErrorException('Failed to update activity: ' + error.message);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      if (!id) {
        throw new BadRequestException('Activity ID is required');
      }

      // Check if activity exists
      await this.findOne(id);
      
      // Delete the activity
      const result = await this.activitiesRepository.delete(id);
      
      if (result.affected === 0) {
        throw new InternalServerErrorException('Failed to delete activity');
      }

      return { message: `Activity with ID ${id} has been successfully deleted` };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to delete activity: ' + error.message);
    }
  }

  async findByStatus(status: ActivityStatus): Promise<Activity[]> {
    try {
      const activities = await this.activitiesRepository.find({
        where: { status },
        order: {
          scheduledTime: 'ASC'
        }
      });
      
      return activities;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch activities by status: ' + error.message);
    }
  }

  async findByFrequency(frequency: ActivityFrequency): Promise<Activity[]> {
    try {
      const activities = await this.activitiesRepository.find({
        where: { frequency },
        order: {
          scheduledTime: 'ASC'
        }
      });
      
      return activities;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch activities by frequency: ' + error.message);
    }
  }

  async findOverdueActivities(): Promise<Activity[]> {
    try {
      const currentDate = new Date();
      
      const overdueActivities = await this.activitiesRepository
        .createQueryBuilder('activity')
        .where('activity.scheduledTime < :currentDate', { currentDate })
        .andWhere('activity.status != :completedStatus', { completedStatus: 'Completed' })
        .orderBy('activity.scheduledTime', 'ASC')
        .getMany();
      
      return overdueActivities;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch overdue activities: ' + error.message);
    }
  }
}
