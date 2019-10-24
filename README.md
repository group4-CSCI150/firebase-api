1. /user
 - get (returns all users)
 - post (adds a new user)
2. /user/byID/:userid 
 - get (gets data by id)
 - put (updates data by id)
 - delete
3. /user/login
 - post


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
