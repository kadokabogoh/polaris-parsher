'use strict'

const chalk = require("chalk")

class LansitecTracker {
    parse(topic, param)
    {
        let payload = String(param)
        if (payload.startsWith("{"))
        {
            payload = JSON.parse(payload)
            payload = payload.payload
        }
        console.log(chalk.greenBright(`processing ${payload}`))

        let i
        const bytes = []
        for (i = 0; i < payload.length; i+=2) {
            const byte = parseInt(payload.substring(i, i + 2), 16)
            bytes.push(byte)
        }

        const result = this.Decode(bytes)
        console.log(chalk.white("writing new data"))
        console.log(chalk.blue(JSON.stringify(result)))
        return result
    }

    Decode(bytes)
    {
        let uplink_type = ((bytes[0] >> 4) & 0x0F)
        switch (uplink_type) {
            case 0x01:
                return this.Register_proc(bytes);

            case 0x02:
                return this.Heartbeat_proc(bytes);

            case 0x03:
                return this.PeriodicalPosition_proc();

            case 0x04:
                return this.OnDemandPosition_proc();

            case 0x05:
                return this.HistoryPosition_proc();

            case 0x06:
                return this.Alarm_proc();

            case 0x07:
                return this.BleCoordinate_proc();

            case 0x08:
                return this.Acknowledge_proc();

            default:
                return null;
        }
    }

    //Message type: Register  0x1
    Register_proc(bytes) {
        const Register_Msg = {
            "type":     0,
            "adr":      0,
            "mode":     0,
            "smode":    0,
            "BleTxPower":    0,
            "dr":       0,
            "breakpoint":0,
            "selfadapt":0,
            "oneoff":   0,
            "alreport": 0,
            "pos":      0,
            "hb":       0,
            "crc":      0
        };
        //type
        Register_Msg.type = "Register";
        //adr
        Register_Msg.adr = ((bytes[0] >> 3) & 0x1);
        switch (Register_Msg.adr) {
            case 0x0:
                Register_Msg.adr = "false";
                break;

            case 0x1:
                Register_Msg.adr = "true";
                break;

            default:
                break;
        }
        //mode
        Register_Msg.mode = (bytes[0] & 0x07);
        switch (Register_Msg.mode) {
            case 0X1:
                Register_Msg.mode = "AU920";
                break;

            case 0x2:
                Register_Msg.mode = "CLAA";
                break;

            case 0x3:
                Register_Msg.mode = "CN470";
                break;

            case 0x4:
                Register_Msg.mode = "AS923";
                break;

            case 0x5:
                Register_Msg.mode = "EU433";
                break;

            case 0x6:
                Register_Msg.mode = "EU868";
                break;

            case 0x7:
                Register_Msg.mode = "US915";
                break;

            default:
                break;
        }
        //smode
        Register_Msg.smode = bytes[1];
        switch (Register_Msg.smode) {
            case 0x01:
                Register_Msg.smode = "AU920";
                break;

            case 0x02:
                Register_Msg.smode = "CLAA";
                break;

            case 0x04:
                Register_Msg.smode = "CN470";
                break;

            case 0x08:
                Register_Msg.smode = "AS923";
                break;

            case 0x10:
                Register_Msg.smode = "EU433";
                break;

            case 0x20:
                Register_Msg.smode = "EU868";
                break;

            case 0x40:
                Register_Msg.smode = "US915";
                break;

            default:
                break;
        }
        //BleTxPower
        Register_Msg.BleTxPower = ((bytes[2] >> 3) & 0x1F) + "";
        //Register_Msg.rfu1 = (bytes[2] & 0x07);
        //DR
        Register_Msg.dr = "DR"+((bytes[3] >> 4) & 0x0F);
        //breakpoint
        Register_Msg.breakpoint = ((bytes[3] >> 3) & 0x01);
        switch (Register_Msg.breakpoint) {
            case 0x0:
                Register_Msg.breakpoint = "false";
                break;

            case 0x1:
                Register_Msg.breakpoint = "true";
                break;

            default:
                break;
        }
        //selfadapt
        Register_Msg.selfadapt = ((bytes[3] >> 2) & 0x01);
        switch (Register_Msg.selfadapt) {
            case 0x0:
                Register_Msg.selfadapt = "false";
                break;

            case 0x1:
                Register_Msg.selfadapt = "true";
                break;

            default:
                break;
        }
        //oneoff
        Register_Msg.oneoff = ((bytes[3] >> 1) &0x01);
        switch (Register_Msg.oneoff) {
            case 0x0:
                Register_Msg.oneoff = "false";
                break;

            case 0x1:
                Register_Msg.oneoff = "true";
                break;

            default:
                break;
        }
        //alreport
        Register_Msg.alreport = (bytes[3] & 0x01);
        switch (Register_Msg.alreport) {
            case 0x0:
                Register_Msg.alreport = "false";
                break;

            case 0x1:
                Register_Msg.alreport = "true";
                break;

            default:
                break;
        }
        //pos
        Register_Msg.pos = ((((bytes[4] << 8) & 0xFF00) | (bytes[5] & 0xFF))*5)+"sec";
        //HB
        Register_Msg.hb = (bytes[6]*10)+"sec";
        //crc
        Register_Msg.crc = (((bytes[7] << 8) & 0xFF00) | (bytes[8] &0xFF));
        return Register_Msg;
    }

//Message type: Heartbeat  0x2
    Heartbeat_proc(bytes) {
        const Heartbeat_Msg = {
            "type":0,
            "ver":0,
            "vol":0,
            "rssi":0,
            "snr":0,
            "gpsstate":0,
            "vibstate":0,
            "chgstate":0,
            "crc":0
        };
        //type
        Heartbeat_Msg.type = "Heartbeat";
        //ver
        Heartbeat_Msg.ver = (bytes[0] & 0x0F);
        //vol
        Heartbeat_Msg.vol = bytes[1];
        //rssi
        Heartbeat_Msg.rssi = (bytes[2]*(-1));
        //SNR
        Heartbeat_Msg.snr = ((((bytes[3] << 8) & 0xFF00) | (bytes[4] & 0xFF))*(0.01));
        //GPSSTATE
        Heartbeat_Msg.gpsstate = ((bytes[5] >> 4) & 0x0F);
        switch (Heartbeat_Msg.gpsstate) {
            case 0x00:
                Heartbeat_Msg.gpsstate = "OFF";
                break;

            case 0x01:
                Heartbeat_Msg.gpsstate = "Boot GPS";
                break;

            case 0x02:
                Heartbeat_Msg.gpsstate = "Locating";
                break;

            case 0x03:
                Heartbeat_Msg.gpsstate = "located";
                break;

            case 0x09:
                Heartbeat_Msg.gpsstate = "no signal";
                break;

            default:
                break;
        }
        //vibstate
        Heartbeat_Msg.vibstate = (bytes[5] & 0x0F)+"level";
        //chgstate
        Heartbeat_Msg.chgstate = ((bytes[6] >> 4) & 0x0F);
        switch (Heartbeat_Msg.chgstate) {
            case 0x0:
                Heartbeat_Msg.chgstate = "power cable disconnected";
                break;

            case 0x5:
                Heartbeat_Msg.chgstate = "power cable connected, charging";
                break;

            case 0x6:
                Heartbeat_Msg.chgstate = "power cable connected, charge complete";
                break;

            default:
                break;
        }
        //crc
        Heartbeat_Msg.crc = (((bytes[7] << 8) & 0xFF00) | (bytes[8] & 0xFF));
        return Heartbeat_Msg;
    }

//Message type: PeriodicalPosition  0x03
    PeriodicalPosition_proc(bytes) {
        var PeriodicalPposition_Msg = {
            "type":0,
            "longitude":0,
            "latitude":0,
            "time":0,
        };
        //type
        PeriodicalPposition_Msg.type = "PeriodicalPosition";
        //longitude
        PeriodicalPposition_Msg.longitude = (((bytes[1] << 24) & 0xFF000000) | ((bytes[2] << 16) & 0xFF0000) | ((bytes[3] << 8) & 0xFF00) | (bytes[4] & 0xFF))+"°";
        //latitude
        PeriodicalPposition_Msg.latitude = (((bytes[5] << 24) & 0xFF000000) | ((bytes[6] << 16) & 0xFF0000) | ((bytes[7] << 8) & 0xFF00) | (bytes[8] & 0xFF))+"°";
        //time
        PeriodicalPposition_Msg.time = (((bytes[9] << 24) & 0xFF000000) | ((bytes[10] << 16) & 0xFF0000) | ((bytes[11] << 8) & 0xFF00) | (bytes[12] & 0xFF))+"sec";
        return PeriodicalPposition_Msg;
    }

//Message type: OnDemandPosition  0x04
    OnDemandPosition_proc(bytes) {
        var OnDemandPosition_Msg = {
            "type":0,
            "msgid":0,
            "longitude":0,
            "latitude":0,
            "time":0,
        };
        //type
        OnDemandPosition_Msg.type = "OnDemandPosition";
        //magid
        OnDemandPosition_Msg.msgid = bytes[1];
        //longitude
        OnDemandPosition_Msg.longitude = (((bytes[2] <<24) & 0xFF000000) | ((bytes[3] << 16) & 0xFF0000) | ((bytes[4] << 8) & 0xFF00) | (bytes[5] & 0xFF))+"°";
        //latitude
        OnDemandPosition_Msg.latitude = (((bytes[6] <<24) & 0xFF000000) | ((bytes[7] << 16) & 0xFF0000) | ((bytes[8] << 8) & 0xFF00) | (bytes[9] & 0xFF))+"°";
        //time
        OnDemandPosition_Msg.time = (((bytes[10] <<24) & 0xFF000000) | ((bytes[11] << 16) & 0xFF0000) | ((bytes[12] << 8) & 0xFF00) | (bytes[13] & 0xFF))+"sec";
        return OnDemandPosition_Msg;
    }

//Message type: HistoryPosition  0x05
    HistoryPosition_proc(bytes) {
        var HistoryPositon_Msg = {
            "type":0,
            "length":0,
            "longitude":0,
            "latitude":0,
            "time":0,
            // "lonoff":0,
            // "latoff":0,
            // "toff":0
        };
        //type
        HistoryPositon_Msg.type = "HistoryPositon";
        //length
        HistoryPositon_Msg.length = (bytes[0] & 0x0F);
        //longitude
        HistoryPositon_Msg.longitude = (((bytes[1] <<24) & 0xFF000000) | ((bytes[2] << 16) & 0xFF0000) | ((bytes[3] << 8) & 0xFF00) | (bytes[4] & 0xFF))+"°";
        //latitude
        HistoryPositon_Msg.latitude = (((bytes[5] <<24) & 0xFF000000) | ((bytes[6] << 16) & 0xFF0000) | ((bytes[7] << 8) & 0xFF00) | (bytes[8] & 0xFF))+"°";
        //time
        HistoryPositon_Msg.time = (((bytes[9] <<24) & 0xFF000000) | ((bytes[10] << 16) & 0xFF0000) | ((bytes[11] << 8) & 0xFF00) | (bytes[12] & 0xFF))+"sec";
        //It's P2P message, need to calcuate the real length.
        if (HistoryPositon_Msg.length == 0xF) {
            return null;
        }
        else{
            //Maximum 6 groups of history position
            if (HistoryPositon_Msg.length > 6) {
                return null;
            }
            for (var i = 0; i < HistoryPositon_Msg.length-1; i++) {
                var tmp = i+2;
                HistoryPositon_Msg["pos"+tmp+"lonoff"] = (((bytes[13+6*i] << 8) & 0xFF00) | (bytes[14+6*i] & 0xFF))+"°";
                HistoryPositon_Msg["pos"+tmp+"latoff"] = (((bytes[15+6*i] << 8) & 0xFF00) | (bytes[16+6*i] & 0xFF))+"°";
                HistoryPositon_Msg["pos"+tmp+"toff"] =  (((bytes[17+6*i] << 8) & 0xFF00) | (bytes[18+6*i] & 0xFF))+"sec";
            }
            return HistoryPositon_Msg;
        }
    }

//Message type: Alarm  0x06
    Alarm_proc(bytes) {
        var Alarm_Msg = {
            "type":0,
            "alarm":0,
            "msgid":0
        };
        //type
        Alarm_Msg.type = "Alarm";
        //alarm
        Alarm_Msg.alarm = (bytes[0] & 0x0F);
        switch (Alarm_Msg.alarm) {
            case 0x1:
                Alarm_Msg.alarm = "sos"
                break;

            default:
                break;
        }
        //msgid
        Alarm_Msg.msgid = bytes[1];
        return Alarm_Msg;
    }

//Message type: BleCoordinate   0x07
    BleCoordinate_proc(bytes) {
        var BleCoordinate_Msg = {
            "type":0,
            "length":0,
            "move":0,
            "name":0,
        };
        BleCoordinate_Msg.type = "BleCoordinate";
        BleCoordinate_Msg.length = (bytes[0] & 0x0F);
        BleCoordinate_Msg.move = bytes[1];
        for (var i = 1; i < BleCoordinate_Msg.length+1; i++) {
            BleCoordinate_Msg["dev"+i+"major"] = (((bytes[6+5*i] << 8) & 0xFF00) | (bytes[7+5*i] & 0xFF));
            BleCoordinate_Msg["dev"+i+"minor"] = (((bytes[8+5*i] << 8) & 0xFF00) | (bytes[9+5*i] & 0xFF));
            BleCoordinate_Msg["dev"+i+"rssi"] = bytes[10+5*i]+"dBm";
        }
        return BleCoordinate_Msg;
    }

//Message type: Acknowledge   0x08
    Acknowledge_proc(bytes) {
        var Acknowledge_Msg = {
            "type":0,
            "result":0,
            "msgid":0
        };
        Acknowledge_Msg.type = "Acknowledge";
        Acknowledge_Msg.result = (bytes[0] & 0x0F);
        switch (Acknowledge_Msg.result) {
            case 0x0:
                Acknowledge_Msg.result = "false";
                break;

            case 0x1:
                Acknowledge_Msg.result = "ture";
                break;

            default:
                break;
        }
        Acknowledge_Msg.msgid = bytes[1];
        return Acknowledge_Msg;
    }

}

module.exports = LansitecTracker