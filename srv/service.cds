using {talenttool.assets as db} from '../db/schema';

service AssetService {
  entity Assets @(restrict: [{
    grant: ['*'],
    to   : 'talent_admin'
  }])                        as
    projection on db.Assets {
      *,
      owner.name as user : String,
    };

  entity Users               as projection on db.User;

  entity MaintenanceRequests as
    projection on db.MaintenanceRequest {
      *,
      asset.assetTag  as assetName      : String,
      technician.name as technicianName : String
    };
}
