import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery, 
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse
} from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity, ActivityStatus, ActivityFrequency } from './entities/activity.entity';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get('test-repository')
  @ApiOperation({
    summary: 'Test repository connection',
    description: 'Tests if the repository is working correctly and can perform basic operations.'
  })
  @ApiOkResponse({
    description: 'Repository test completed',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        working: { type: 'boolean' }
      }
    }
  })
  async testRepository() {
    return this.activitiesService.testRepository();
  }

  @Get('test-db')
  @ApiOperation({
    summary: 'Test database connection',
    description: 'Simple endpoint to test if the database connection is working properly.'
  })
  @ApiOkResponse({
    description: 'Database connection test successful',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        timestamp: { type: 'string' },
        tableExists: { type: 'boolean' }
      }
    }
  })
  async testDatabase() {
    try {
      // Try to access the database
      const count = await this.activitiesService.findAll();
      return {
        message: 'Database connection successful',
        timestamp: new Date().toISOString(),
        tableExists: true,
        recordCount: count.length
      };
    } catch (error) {
      return {
        message: 'Database connection failed',
        timestamp: new Date().toISOString(),
        tableExists: false,
        error: error.message
      };
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new activity',
    description: 'Creates a new activity with the provided details including name, description, scheduled time, and frequency.'
  })
  @ApiBody({
    type: CreateActivityDto,
    description: 'Activity creation data',
    examples: {
      example1: {
        summary: 'Monthly Market Inspection',
        value: {
          name: 'Monthly Market Inspection',
          description: 'Conduct thorough inspection of all market stalls and facilities',
          scheduledTime: '2024-01-15T09:00:00.000Z',
          frequency: ActivityFrequency.Monthly,
          status: ActivityStatus.Planned,
          lastCompleted: '2023-12-15T09:00:00.000Z'
        }
      },
      example2: {
        summary: 'Weekly Cleaning',
        value: {
          name: 'Weekly Cleaning',
          description: 'General cleaning of market areas',
          scheduledTime: '2024-01-08T08:00:00.000Z',
          frequency: ActivityFrequency.Weekly,
          lastCompleted: '2024-01-01T08:00:00.000Z'
        }
      }
    }
  })
  @ApiCreatedResponse({
    description: 'Activity successfully created',
    type: Activity
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid input data or constraint violation'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to create activity'
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createActivityDto: CreateActivityDto): Promise<Activity> {
    return this.activitiesService.create(createActivityDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all activities',
    description: 'Retrieves all activities ordered by scheduled time in ascending order.'
  })
  @ApiOkResponse({
    description: 'List of all activities retrieved successfully',
    type: [Activity]
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to fetch activities'
  })
  async findAll(): Promise<Activity[]> {
    return this.activitiesService.findAll();
  }

  @Get('overdue')
  @ApiOperation({
    summary: 'Get overdue activities',
    description: 'Retrieves all activities that are past their scheduled time and not completed.'
  })
  @ApiOkResponse({
    description: 'List of overdue activities retrieved successfully',
    type: [Activity]
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to fetch overdue activities'
  })
  async findOverdueActivities(): Promise<Activity[]> {
    return this.activitiesService.findOverdueActivities();
  }

  @Get('status/:status')
  @ApiOperation({
    summary: 'Get activities by status',
    description: 'Retrieves all activities filtered by their current status.'
  })
  @ApiParam({
    name: 'status',
    description: 'Activity status to filter by',
    enum: ActivityStatus,
    example: ActivityStatus.Planned
  })
  @ApiOkResponse({
    description: 'List of activities with specified status retrieved successfully',
    type: [Activity]
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid status parameter'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to fetch activities by status'
  })
  async findByStatus(@Param('status') status: ActivityStatus): Promise<Activity[]> {
    return this.activitiesService.findByStatus(status);
  }

  @Get('frequency/:frequency')
  @ApiOperation({
    summary: 'Get activities by frequency',
    description: 'Retrieves all activities filtered by their frequency.'
  })
  @ApiParam({
    name: 'frequency',
    description: 'Activity frequency to filter by',
    enum: ActivityFrequency,
    example: ActivityFrequency.Monthly
  })
  @ApiOkResponse({
    description: 'List of activities with specified frequency retrieved successfully',
    type: [Activity]
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid frequency parameter'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to fetch activities by frequency'
  })
  async findByFrequency(@Param('frequency') frequency: ActivityFrequency): Promise<Activity[]> {
    return this.activitiesService.findByFrequency(frequency);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get activity by ID',
    description: 'Retrieves a specific activity by its unique identifier.'
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the activity',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiOkResponse({
    description: 'Activity retrieved successfully',
    type: Activity
  })
  @ApiNotFoundResponse({
    description: 'Activity not found with the specified ID'
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid ID parameter'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to fetch activity'
  })
  async findOne(@Param('id') id: string): Promise<Activity> {
    return this.activitiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update activity',
    description: 'Updates an existing activity with the provided data. Only the fields that need to be updated should be included.'
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the activity to update',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({
    type: UpdateActivityDto,
    description: 'Activity update data',
    examples: {
      example1: {
        summary: 'Update status to completed',
        value: {
          status: ActivityStatus.Completed,
          lastCompleted: new Date().toISOString()
        }
      },
      example2: {
        summary: 'Update scheduled time',
        value: {
          scheduledTime: '2024-02-15T10:00:00.000Z'
        }
      }
    }
  })
  @ApiOkResponse({
    description: 'Activity updated successfully',
    type: Activity
  })
  @ApiNotFoundResponse({
    description: 'Activity not found with the specified ID'
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid input data or constraint violation'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to update activity'
  })
  async update(
    @Param('id') id: string, 
    @Body() updateActivityDto: UpdateActivityDto
  ): Promise<Activity> {
    return this.activitiesService.update(id, updateActivityDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete activity',
    description: 'Permanently removes an activity from the system.'
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the activity to delete',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiOkResponse({
    description: 'Activity deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Activity with ID 123e4567-e89b-12d3-a456-426614174000 has been successfully deleted'
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Activity not found with the specified ID'
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid ID parameter'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Failed to delete activity'
  })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.activitiesService.remove(id);
  }
}
