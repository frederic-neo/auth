#!/bin/sh
bb start -bo -env preview 

# Navigate to the schema folder
cd ./auth_be_shared

# Run Prisma migrate command
npx prisma db push

# Navigate back to the original directory
cd -

 tail -f /dev/null
