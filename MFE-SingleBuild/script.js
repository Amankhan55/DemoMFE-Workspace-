const replace = require('replace-in-file');
const config = require('./config');

const options = {
    files: ['./dist/**/*.html', './dist/**/*.js'],
    from: [],
    to: [],
    allowEmptyPaths: true,
};

const findAndReplace = () => {
    for (const [key, value] of Object.entries(config[process.env.DEPLOY_ENV])) {
        options.from.push(new RegExp(value.includes('localhost') ? `https://${key}` : key, 'g'));
        options.to.push(value.includes('localhost') ? `http://${value}` : value);
    }

    replace(options, (error, results) => {
        if(error) {
            return console.error('Error occurred: ', error);
        }
        console.log('Replacement results: ', results);
    });
}

findAndReplace();