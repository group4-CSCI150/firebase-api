/user               get|post
/user/[userid]      get|post|delete
/user/find/[name]   get

Finder
|
 - Organization
    |
     - :orgname
        |
         - Info
         - User
            |
             - :username
                |
                 - name
                 - last
                 - Birthday
                 - email
                 - description
                 - picture (ref to folder on firebase Storage with :username)
                 - Friend
                    |
                     - list of refs to :username
                 - Intrests
                    |
                     - key value pair
