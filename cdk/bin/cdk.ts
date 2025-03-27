#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BackendAdminPanelStack } from '../lib/backend-admin-panel-stack';
import 'dotenv/config'
import { ConfigService } from '@nestjs/config';

const app = new cdk.App();
const config : ConfigService = new ConfigService(process.env);
new BackendAdminPanelStack(app, 'BackendAdminPanelStack', {},config);