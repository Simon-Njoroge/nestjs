import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Inquiry } from '../../inquiries/entities/inquiry.entity';
@Entity()
export class GuestUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @OneToMany(() => Inquiry, (inquiry) => inquiry.guestUser)
  inquiries: Inquiry[];
}
