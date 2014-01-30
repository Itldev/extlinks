#!/bin/bash

export MAVEN_OPTS="-Xms1024m -Xmx4096m -XX:PermSize=1024m";mvn install -Prun,rad -DskipTests=true

