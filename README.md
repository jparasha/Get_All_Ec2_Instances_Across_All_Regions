# Get_All_Ec2_Instances_Across_All_Regions

###### An AWS Lambda function is needed to run.
[The Script](https://github.com/jparasha/Get_All_Ec2_Instances_Across_All_Regions/blob/master/getInstances.js) runs across all AWS regions and makes API Call       `DescribeInstances()`, to get the instances.

_______________________________________________________________________________________________________________________________________
#### getInstances function:
  -  [Steps](https://github.com/jparasha/Get_All_Ec2_Instances_Across_All_Regions/tree/master#steps)  
  -  [IAM Roles](https://github.com/jparasha/Get_All_Ec2_Instances_Across_All_Regions/tree/master#required-iam-roles-for-lambda-function)
  -  [Optionals (API gateway and Cloudwatch Automation)](https://github.com/jparasha/Get_All_Ec2_Instances_Across_All_Regions/tree/master#optional)

_______________________________________________________________________________________________________________________________________
  
### Steps:
     
*   Create a nodejs lambda function.
*   Add the script to your function.
*   Save and Test the script.
*   Additionally, Data can be found in cloudwatch logs.

##### Optional

  ###### a) Automating Script through Cloudwatch
  
  *   Navigate to Event Source.
  *   Click Add new Event source and Choose Event type as - `Cloudwatch Events- Schedule`.
  *   Add Rule name, Description and Schedule Expression as `cron(30 14 ? * MON-FRI *)` which represents Cron job Schedule to be  followed MON-FRI at 14:30 UTC.
  *   Enable the source and this script will start all instances tagged @ 14:30.
  
  ###### b) Creating API through API-Gateway
  
  *   Goto API-gateway from aws console.
  *   Click on `CreateAPI`
  *   Select `New API` and name your API.
  *   Click on `Resources` under your created API and you will see `/`
  *   Now click on `Actions` button and select `Create Method`
  *   In the dropdown, choose `GET` and click ok.
  *   In the GET-Setup choose `Integration Type` as Lambda Funciton
  *   Select Lambda Region and the name of above function just created.
  *   Submit and accept the permission request.
  *   Now Click on your created `GET` method.
  *   Select `Integration Request`
  *   Click on `BODY MAPPING TEMPLATES`.
  *   Under `Request body Passthrough` choose `When there are no templates defined`
  *   Now, under `content-type` click `Add Mapping template`
  *   In the input-box , type "application/json" (without quotes) and click ok
  *   Now click on "applicatio/json" and template body will show up at the bottom
  *   In the generate template dropdown click `Method Request passthrough`
  *   Save the code.
  *   Go back to  `GET` and click on `Test` 
  *   if the callback is successful it will show data.
  *   Once the call back is successful, goto `Actions` button and select `Deploy API`
  *   Give a Stage name and click Deploy.
  *   Goto your API name and got dashboard to see the `API URL`!
  *   Do remember to secure your api through keys in Production environments


### Required IAM Roles for Lambda Function:
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "MyStatementId",
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeInstances",                
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
}
```
_______________________________________________________________________________________________________________________________________
