import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('companies')
export class Company {
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false, type:'varchar'})
    name:number

    @Column({nullable:false, type:'varchar'})
    ticker_symbol:number

    @Column({type:'varchar', nullable:false})
    exchange:string

    @Column({type:'varchar', nullable:false})
    industry:string

    @Column({type:'varchar', nullable:false})
    sector:string

    @Column({type:'varchar', nullable:true})
    head_quarters:string

    @Column({type:'date', nullable:true})
    founded_date:Date

    @Column({type:'text', nullable:true})
    description:string

    @Column({type:'int', nullable:true})
    employee_count:string
    @Column({type:'varchar', nullable:true})
    website_url:string

    @Column({type:'text', nullable:true})
    contact_email:string

    @Column({type:'int', nullable:true})
    contact_number:string

    @Column({type:'varchar', nullable:true})
    ceo_name:string

    @Column({type:'varchar', nullable:true})
    board_chairperson:string

    @Column({type:'varchar', nullable:true})
    cfo_name:string

    @Column({type:'varchar', nullable:true})
    coo_name:string

    @Column({type:'varchar', nullable:true})
    legal_status:string

    @Column({type:'varchar', nullable:true})
    audit_firm:string

    @Column({type:'varchar', nullable:true})
    regulatory_body:string

    @Column({type:'json', nullable:true})
    social_media_handles:string

    @Column({type:'text', nullable:true})
    notable_achievements:string

    @Column({type:'int', nullable:true})
    patents_owned:number

    @Column({type:'text', nullable:true})
    trademarks:string

    @Column({type:'varchar', nullable:true})
    logo_url:string

    @Column({type:'timestamp', nullable:true})
    created_at:Date

    @Column({type:'timestamp', nullable:true})
    updated_at:Date

}