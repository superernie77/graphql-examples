import {getJobs} from './db/jobs.js'
import {getCompany} from './db/companies.js'


export const resolvers = {
    Query: {
        jobs : () => getJobs()
    },

    Job: {
        company: (job) => getCompany(job.companyId),
        date : (job) => {return job.createdAt.slice(0,10) }
    }
};