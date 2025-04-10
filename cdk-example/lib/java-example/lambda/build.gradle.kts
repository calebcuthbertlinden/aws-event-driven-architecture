plugins {
    java
}

group = "com.example"
version = "1.0"

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.amazonaws:aws-lambda-java-core:1.2.3")
    implementation("com.amazonaws:aws-lambda-java-events:3.11.1")
}

tasks.register<Zip>("buildZip") {
    group = "build"
    dependsOn("build")
    from({
        configurations.runtimeClasspath.get().map { if (it.isDirectory) it else zipTree(it) }
    })
    from("build/classes/java/main")
    archiveFileName.set("FirstLambda.zip")
    destinationDirectory.set(file("$buildDir/dist"))
    duplicatesStrategy = DuplicatesStrategy.EXCLUDE
}
