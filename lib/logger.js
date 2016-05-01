import path from 'path';
import bunyan from 'bunyan';

const log_path = path.join(__dirname, '..');

const create_logger_options = {
    name: 'nordea-report-parser',
    streams: [
      {
        level: 'info',
        path: path.join(log_path, 'nordea-report-parser.log'),
        type: 'file',
      },
    ],
  };

export default bunyan.createLogger(create_logger_options);
