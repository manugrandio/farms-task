import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
