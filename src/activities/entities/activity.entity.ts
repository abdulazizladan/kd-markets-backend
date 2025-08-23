import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum ActivityStatus {
    Planned = 'Planned',
    InProgress = 'In Progress',
    Completed = 'Completed',
    Overdue = 'Overdue'
  }

export enum ActivityFrequency {
    Daily = 'Daily',
    Weekly = 'Weekly',
    Monthly = 'Monthly',
    Quarterly = 'Quarterly',
    Yearly = 'Yearly',
    AdHoc = 'Ad Hoc' // For one-off activities
}

@Entity({name: 'Activity'})
export class Activity {
    @PrimaryGeneratedColumn('uuid')
    "id"?: string;

    @Column({ type: 'varchar' })
    "name": string;

    @Column({ type: 'varchar' })
    "description": string;

    @Column({ type: 'datetime' })
    "scheduledTime": Date;

    @Column({type: 'text', enum: ActivityFrequency})
    "frequency": ActivityFrequency;

    @Column({type: 'text', enum: ActivityStatus})
    "status": ActivityStatus = ActivityStatus.Planned; // Default status is 'Planned'

    @Column({type: 'date', nullable: true})
    "lastCompleted": Date;
}