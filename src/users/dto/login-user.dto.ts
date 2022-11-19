import { OmitType } from '@nestjs/mapped-types';

import { CreateUserDto } from './create-user.dto';

export class LoginUserDTO extends OmitType(CreateUserDto, ['email']) {}
