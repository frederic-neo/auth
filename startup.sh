#!/bin/sh

# Start your application
bb start -bt function -pm2

# Navigate to the schema folder
cd ./auth_be_shared

# Run Prisma migrate command
npx prisma db push

# Navigate back to the original directory
cd -

# Keep the container running by tailing /dev/null
tail -f /dev/null
