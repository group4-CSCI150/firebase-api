/organization                       post / get <br>
/organization/:orgId                get <br>

/user/:orgId                        get / post <br>
/user/:orgId/:userid                get / post / delete <br>
/user/login//:orgId/:userid/:pass   get <br>


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
                 - password
                 - description
                 - picture (ref to folder on firebase Storage with :username)
                 - Friend
                     - list of refs to :username
                 - Intrests
                     - list of key value pair
