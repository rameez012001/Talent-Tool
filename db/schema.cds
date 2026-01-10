namespace talenttool.assets;

using {
    cuid,
    managed
} from '@sap/cds/common';

entity Assets : cuid, managed {
  assetTag   : String(50);
  deviceId   : String(50);
  status     : String enum {
    AVAILABLE;
    IN_USE;
    MAINTENANCE;
    RETIRED;
  } default 'AVAILABLE';
  owner      : Association to one User;
  assignedOn : Date;
  returnedOn : Date;
}

entity User : cuid, managed {
  name       : String(100);
  email      : String(255);
  department : String enum {
    IT;
    SDE;
  } default 'SDE';
  assets     : Association to many Assets
                 on assets.owner = $self;
}

entity MaintenanceRequest : cuid, managed {
  title       : String(100);
  description : String;
  priority    : String enum {
    HIGH;
    MID;
    LOW;
  } default 'LOW';
  status      : String enum {
    OPEN;
    INPROGRESS;
    FIXED;
  } default 'OPEN';
  asset       : Association to one Assets;
  technician  : Association to one User;
}
