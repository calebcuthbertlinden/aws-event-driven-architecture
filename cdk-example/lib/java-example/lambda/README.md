# Java Lambdas

## Install Java
```
brew install openjdk@21
```

### Link it so your system can find it
```
sudo ln -sfn /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk
```

### Then export it in your shell profile (.zshrc, .bashrc, etc.)
```
echo 'export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"' >> ~/.zshrc
echo 'export CPPFLAGS="-I/opt/homebrew/opt/openjdk@21/include"' >> ~/.zshrc
source ~/.zshrc
```

### Confirm it works
```
java -version
```

You should see something like:
```
openjdk version "21" 2023-09-19
OpenJDK Runtime Environment ...
```

## Install gradle
```
brew install gradle
```

Then verify it's available:
```
gradle -v
```

### Generate Gradle wrapper
Inside this folder
```
gradle wrapper
```

This will create
```
./gradlew              # Unix shell script
./gradlew.bat          # Windows batch script
/gradle/wrapper/
  ├── gradle-wrapper.jar
  └── gradle-wrapper.properties
```

## Lambda code
In Java a lambda handler will look like this
```
package com.example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.SQSEvent;

public class FirstLambda implements RequestHandler<SQSEvent, String> {
    @Override
    public String handleRequest(SQSEvent event, Context context) {
        for (SQSEvent.SQSMessage message : event.getRecords()) {
            context.getLogger().log("Received SQS message: " + message.getBody() + "\n");
        }
        return "Processed messages!";
    }
}
```

## ZIP the lambda
```
./gradlew buildZip
```

## Update reference in the stack
```
code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-java', 'build', 'dist', 'first-lambda.zip')),
handler: 'com.example.FirstLambda::handleRequest',
```

## Update your .gitignore
[Example](.gitignore)