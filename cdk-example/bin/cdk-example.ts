#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkExampleStack } from '../lib/example/cdk-example-stack';
import { CdkJavaExampleStack } from '../lib/java-example/java-example.stack';

const app = new cdk.App();
new CdkExampleStack(app, 'CdkExampleStack', {});
new CdkJavaExampleStack(app, 'CdkJavaExampleStack', {});