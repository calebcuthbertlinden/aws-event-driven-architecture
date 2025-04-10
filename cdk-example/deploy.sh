npm run build

# Synthesize the stacks into templates
cdk synth CdkExampleStack
cdk deploy CdkExampleStack

# Deploy the templates
cdk synth CdkJavaExampleStack
cdk deploy CdkJavaExampleStack