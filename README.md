# INTRODUCTION

This is a backend repo for book management full stack application , in this two api's are designed one is to add book by name to mongodb database and other one is get books which filter books according to page_size , page , sort_by and sort_order query parameters.

# GET STARTED

1. ENVIRONMENT
> 1. Create .env file and add mongodb url in it.
> 2. you can find example content in .env.example file

2. RUNNING
> 1. npm install
> 2. npm start (npm start will start the nodemon and express server , you can edit the package.json file accordingly)

3. Logging
> 1. Winston logger is used to log error and info messages in logs file to debug the error easily in deployment

# API DOCUMENTATION

## Add Book API
> In this user can add book by name to mongodb database by provide name param to this api.
> GOOGLE API is used in this api to fetch data according to name.
> this api will filter all the rows which contains title, author , description , url , publishedDate and genre and then create and push books mongoose model to items array. then with insert many method of mongoose it will add those rows to mongodb database 

## Get Books API
> In this api be default page_size , page , sort_by and sort_order are set to 10 , 1 , name and asc (ascending) respectively in case if user doesn't provided any query parameters it will set the values to default values.

> In case if user provides invalid query parameters it will return error.

> In case if user provides valid query parameters it will return books according to page_size , page , sort_by and sort_order query parameters.

> page_size is a number and page is a number and sort_by and sort_order are string in lowercase.

> page_size and page should be greater then zero and in case if page index is out range then it will return index out of range error.

> sort_by must contains one of the value from name, published_year , author and genre 

> sort_order must contains one of the value from asc or desc. 

> Example : <api_url>?page_size=10&page=1&sort_by=name&sort_order=asc