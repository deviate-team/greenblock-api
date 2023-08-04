import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsNumber, IsObject, IsUrl, IsPositive, isNotEmpty } from 'class-validator';
import { IContract } from '@/common/interfaces/contract.interface';
import { ITimePeriod } from '@/common/interfaces/timePeroid.interface';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Project Name',
    example: 'ปลูกต้นไม้100ล้านต้น',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Project description',
    example: 'ปลูกต้นไม่กับพี่ตูน',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Project date',
    example: 'วันที่เริ่ม',
  })

  @ApiProperty({
    description: 'Project date',
    example: 'วันที่เริ่ม',
  })
  @IsString()
  contract: IContract;

  @ApiProperty({
    description: 'Project description',
    example: 50,
  })
  @IsNumber()
  @IsPositive()
  price_by_unit: number;

  @ApiProperty({
    description: 'Project time_peroid',
    example: {
        start: '2021-01-01',
        end: '2022-01-01',
    },
    type: Object,
  })
  @IsString()
  time_period: ITimePeriod;

  @ApiProperty({
    description: 'Project image',
    example: 'img_path',
  })
  @IsUrl()
  image: string;

  @ApiProperty({
    description: 'Project maximun money amount',
    example: 10000,
  })
  @IsNumber()
  @IsPositive()
  maximum: number;
}
