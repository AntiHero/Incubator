import { Controller, Delete } from '@nestjs/common';

@Controller('testing')
export class TestingController {
  @Delete('all-data')
  deleteAllData() {
    /* TODO */
  }
}
