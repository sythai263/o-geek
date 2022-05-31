'use strict';

import { IsInt } from 'class-validator';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({
        type: 'timestamp with time zone',
        name: 'created_at',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
        name: 'updated_at',
    })
    updatedAt: Date;

    @DeleteDateColumn({
        type: 'timestamp with time zone',
        name: 'deleted_at',
    })
    deletedAt?: Date;

    @IsInt()
    @Column({
        name: 'created_by',
    })
    createdBy: number;

    @IsInt()
    @Column({
        name: 'updated_by',
    })
    updatedBy: number;

    @IsInt()
    @Column({
        name: 'deleted_by',
    })
    deletedBy?: number;

    constructor(id?: number) {
        this.id = id;
    }
}
