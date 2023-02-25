import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity"

@Entity()
export class Farm {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column()
  public name: string;

  @Column({ nullable: true })
  public address?: string;

  @Column({ nullable: true })
  public coordinates?: string;

  @Column()
  public size?: number;

  @Column()
  public cropYield?: number;

  @ManyToOne(() => User, (user) => user.farms)
  user: User
}
