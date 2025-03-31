import { BaseListResponse } from '@src/models/models-api/response.models';
import { WorkoutsModel } from '@src/models/models-db/index.model';

export interface WorkoutsApiModel extends BaseListResponse<WorkoutsModel> {}
export interface WorkoutsAddApiModel extends WorkoutsModel {}
