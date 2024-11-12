import {BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from "typeorm";
import {StockPrice} from "./stock_prices.entity";

@Entity('companies')
export class Company extends BaseEntity {
    @PrimaryGeneratedColumn({type: 'bigint', unsigned: true})
    id: number

    @Column({nullable: false, type: 'varchar', length: 255})
    name: string

    @Column({nullable: false, type: 'varchar', length: 20, unique: true})
    ticker_symbol: string

    @Column({type: 'varchar', length: 50, nullable: false})
    exchange: string

    @Column({type: 'varchar', length: 100, nullable: false})
    sector: string

    @Column({type: 'varchar', length: 255, nullable: true})
    business_nature: string

    @Column({type: 'varchar', length: 100, nullable: true})
    sub_sector: string

    @Column({type: 'varchar', length: 255, nullable: true})
    headquarters: string

    @Column({type: 'date', nullable: true})
    founded_date: Date

    @Column({type: 'text', nullable: true})
    description: string

    @Column({type: 'integer', nullable: true})
    employee_count: number  // Changed from string to number

    @Column({type: 'varchar', length: 255, nullable: true})
    website_url: string

    @Column({type: 'varchar', length: 255, nullable: true})  // Changed from text to varchar
    contact_email: string

    @Column({type: 'varchar', length: 20, nullable: true})  // Changed from int to varchar
    contact_number: string

    @Column({type: 'varchar', length: 255, nullable: true})
    ceo_name: string

    @Column({type: 'varchar', length: 255, nullable: true})
    board_chairperson: string

    @Column({type: 'varchar', length: 255, nullable: true})
    cfo_name: string

    @Column({type: 'varchar', length: 255, nullable: true})
    coo_name: string

    @Column({type: 'varchar', length: 50, nullable: true})
    legal_status: string

    @Column({type: 'varchar', length: 255, nullable: true})
    audit_firm: string

    @Column({type: 'varchar', length: 255, nullable: true})
    regulatory_body: string

    @Column({type: 'jsonb', nullable: true})  // Changed to jsonb for better performance
    social_media_handles: Record<string, string>  // Changed type to proper TypeScript object

    @Column({type: 'text', nullable: true})
    notable_achievements: string

    @Column({type: 'integer', nullable: true})
    patents_owned: number

    @Column({type: 'text', nullable: true})
    trademarks: string

    @Column({type: 'varchar', length: 255, nullable: true})
    logo_url: string

    @Column({type: 'bigint', nullable: false, default: 0})
    watchlist_points: number

    @Column({type: 'bigint', nullable: false, default: 0})
    trade_points: number

    @CreateDateColumn({type: 'timestamptz'})
    created_at: Date

    @UpdateDateColumn({type: 'timestamptz'})
    updated_at: Date

    @OneToOne(() => StockPrice, (stock_price) => stock_price.company)
    @JoinColumn()  // Added JoinColumn decorator
    stock_price: StockPrice
}