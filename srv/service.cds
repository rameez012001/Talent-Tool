using { talenttool.assets as db } from '../db/schema';

service AssetService {
  entity Assets as projection on db.Assets;
  entity Users as projection on db.User;
  entity MaintenanceRequests as projection on db.MaintenanceRequest;
}