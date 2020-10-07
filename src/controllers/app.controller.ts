import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from '../app.service';
import { LoggerService } from '../services/logger.service';
import { Logger } from 'winston';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExampleApiRequest, ExampleApiResponse, HelloworldResponse } from './app.dto';
import { ContextId } from '../decorators/context-id.decorator';

@ApiTags('Example controller')
@ApiBearerAuth() // this is to enable to add token to the request
@Controller()
export class AppController {
  private readonly logger: Logger;

  constructor(private readonly appService: AppService,
              private readonly loggerService: LoggerService) {
    this.logger = this.loggerService.getLogger(this.constructor.name);
  }


  @Get()
  @ApiResponse({ type: HelloworldResponse, status: 200, description: 'returning hello for each request' })
  async getHello(@ContextId() contextId: string): Promise<HelloworldResponse> {
    const log = this.logger.child({ contextId });
    log.info('requested to say hello');
    return { message: this.appService.getHello() };
  }

  @Post()
  @ApiResponse({ type: ExampleApiResponse, status: 201, description: 'sum a number array' })
  async exampleApi(@ContextId() contextId: string, @Body() { data }: ExampleApiRequest): Promise<ExampleApiResponse> {
    const log = this.logger.child({ contextId });
    log.info('summing numbers', { numbers: data });
    return { sum: this.appService.accumulate(data) };
  }
}
