import {config} from 'config/config';
import * as os from 'os';

/**
 * Service responsible for gathering server and subsystem health/status.
 * e.g. ensuring we can connect to couchbase and various other dbs.
 * @type {{health, couchbaseStatus, serverStatus, osStatus}}
 */
export let service = {
  getHealth: async function () {
    let serverStatus = this.serverStatus;
    let osStatus = this.osStatus;
    let subsystemStatuses = [
      serverStatus,
      osStatus
    ];

    // iterate over each status and if one is not ok, the overall status will not be ok.
    let systemOverallStatus = subsystemStatuses.reduce((previous, current)=>{
      return {
        ok: previous.ok && current.ok
      };
    });

    let status = {
      systemOverallStatus,
      serverStatus,
      osStatus
    };

    return status;
  },

  get serverStatus () {
    return {
      get ok () {
        return true;
      },
      config: config
    };
  },

  get osStatus () {
    return {
      ok: true,
      hostname: os.hostname(),
      type: os.type(),
      platform: os.platform(),
      arch: os.arch(),
      release: os.release(),
      uptime: os.uptime(),
      loadavg: os.loadavg(),
      totalmem: os.totalmem(),
      freemem: os.freemem(),
      cpus: os.cpus(),
      networkInterfaces: os.networkInterfaces()
    };
  }
};
