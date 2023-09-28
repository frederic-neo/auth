#!/bin/sh

# Navigate to the schema folder
cd ./auth_be_shared

# Run Prisma migrate command
npx prisma db push

# Navigate back to the original directory
cd -

bb start -bo -env preview && tail -f /dev/null"
