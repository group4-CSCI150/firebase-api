/user               get | post <br>
/user/:userid       get | post | delete <br>
/user/find/:name    get <br>


Finder
 - Organization
     - :orgname
         - Info
         - User
             - :username
                 - name
                 - last
                 - Birthday
                 - email
                 - description
                 - picture (ref to folder on firebase Storage with :username)
                 - Friend
                     - list of refs to :username
                 - Intrests
                     - key value pair
