/user
 - get / post <br>
/user/byID/:userid 
 - get / put / delete <br>
/user/login
 - post <br>


Finder
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
