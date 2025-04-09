exports.first_lambda = async (event) => {
    console.log("Event received:", event);
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Success from Terraform Lambda!" }),
    };
};

exports.second_lambda = async (event) => {
    console.log("Event received:", event);
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Success from Terraform Lambda!" }),
    };
};

exports.third_lambda = async (event) => {
    console.log("Event received:", event);
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Success from Terraform Lambda!" }),
    };
};