#!/bin/bash

mongo locationReminder --eval \
"
db.createUser({
  user: 'locationRemindermongouser',
  pwd: 'locationRemindermongopass',
  roles: [ { role: 'userAdminAnyDatabase', db: 'admin' } ]
})
"
