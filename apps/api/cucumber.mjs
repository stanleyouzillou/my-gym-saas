import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const featuresPath = path.resolve(__dirname, '../../features').replace(/\\/g, '/');
const stepsPath = path.resolve(__dirname, 'bdd/steps/**/*.ts').replace(/\\/g, '/');

export default {
  default: {
    paths: [featuresPath],
    require: [stepsPath],
    requireModule: ['ts-node/register'],
    publishQuiet: true,
    format: ['progress'],
    parallel: 1,
  },
};
