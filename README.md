/user &emsp &emsp get / post <br>
/user/byID/:userid &emsp &emsp get / post / delete <br>
/user/login &emsp &emsp post <br>


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
