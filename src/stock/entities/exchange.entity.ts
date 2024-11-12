import {BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity('exchanges')
export class Exchange extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false, type: 'varchar', length: 255})
    name: string

    @Column({nullable: false, type: 'varchar', length: 50})
    symbol: string

    @Column({type: 'decimal', precision: 10, scale: 2, nullable: true})
    asi: number  // Changed from string to number since it's a numeric value

    @Column({type: 'integer', nullable: true})  // 'int' works too, but 'integer' is more explicit
    deals: number

    @Column({type: 'bigint', nullable: true})
    volume: number  // Changed from string to number since it's a numeric value

    @Column({type: 'decimal', precision: 15, scale: 2, nullable: true})
    value: number

    @Column({type: 'decimal', precision: 15, scale: 2, nullable: true})
    cap: number

    @Column({type: 'decimal', precision: 15, scale: 2, nullable: true})
    bond_cap: number

    @Column({type: 'decimal', precision: 15, scale: 2, nullable: true})
    off_cap: number  // Changed from string to number since it's a numeric value

    @Column({type: 'timestamptz', nullable: false})  // Using timestamptz for timezone awareness
    open_time: Date

    @Column({type: 'timestamptz', nullable: false})
    close_time: Date  // Changed from string to Date

    @CreateDateColumn({type: 'timestamptz'})  // Using CreateDateColumn decorator
    created_at: Date

    @UpdateDateColumn({type: 'timestamptz'})  // Using UpdateDateColumn decorator
    updated_at: Date
}