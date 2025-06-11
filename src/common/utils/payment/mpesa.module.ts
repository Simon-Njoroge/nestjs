import { Module } from '@nestjs/common';
import { MpesaClient } from "./mpesa-client";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  providers: [MpesaClient],
  exports: [MpesaClient],
})

export class MpesaModule {}