const StageUtils = require('../dto/stageUtils');
const Planner = require('./ai/Planner');
const Memory = require('./ai/Memory');
var CSV = require('winston-csv-format').default;
var Utils = require('./utils');

var { createLogger, transports } = require('winston');


const dataLogger = createLogger({
  level: 'info',
  format: CSV([
    'posX_0', 'posY_0', 'velX_0', 'velY_0', 'accX_0', 'accY_0', 'feaLla_0', 'feaMon_0', 'feaSpr_0', 'resAir_0', 'resVel_0', 'resMon_0', 'pulse_0', 'neighbour_0', 'state_0', 'stageKms_0', 'stageAngle_0', 'pendingKms_0', 'pendingAngle_0', 'remainderOverallTime_0', 'remainderActualTime_0', 'leader_0','innovador_0','metodico_0','gregario_0', 'inquieto_0',
    'posX_1', 'posY_1', 'velX_1', 'velY_1', 'accX_1', 'accY_1', 'feaLla_1', 'feaMon_1', 'feaSpr_1', 'resAir_1', 'resVel_1', 'resMon_1', 'pulse_1', 'neighbour_1', 'state_1', 'stageKms_1', 'stageAngle_1', 'pendingKms_1', 'pendingAngle_1', 'remainderOverallTime_1', 'remainderActualTime_1', 'leader_1','innovador_1','metodico_1','gregario_1', 'inquieto_1',
    'posX_2', 'posY_2', 'velX_2', 'velY_2', 'accX_2', 'accY_2', 'feaLla_2', 'feaMon_2', 'feaSpr_2', 'resAir_2', 'resVel_2', 'resMon_2', 'pulse_2', 'neighbour_2', 'state_2', 'stageKms_2', 'stageAngle_2', 'pendingKms_2', 'pendingAngle_2', 'remainderOverallTime_2', 'remainderActualTime_2', 'leader_2','innovador_2','metodico_2','gregario_2', 'inquieto_2',
    'posX_3', 'posY_3', 'velX_3', 'velY_3', 'accX_3', 'accY_3', 'feaLla_3', 'feaMon_3', 'feaSpr_3', 'resAir_3', 'resVel_3', 'resMon_3', 'pulse_3', 'neighbour_3', 'state_3', 'stageKms_3', 'stageAngle_3', 'pendingKms_3', 'pendingAngle_3', 'remainderOverallTime_3', 'remainderActualTime_3', 'leader_3','innovador_3','metodico_3','gregario_3', 'inquieto_3',
    'posX_4', 'posY_4', 'velX_4', 'velY_4', 'accX_4', 'accY_4', 'feaLla_4', 'feaMon_4', 'feaSpr_4', 'resAir_4', 'resVel_4', 'resMon_4', 'pulse_4', 'neighbour_4', 'state_4', 'stageKms_4', 'stageAngle_4', 'pendingKms_4', 'pendingAngle_4', 'remainderOverallTime_4', 'remainderActualTime_4', 'leader_4','innovador_4','metodico_4','gregario_4', 'inquieto_4',
    'posX_5', 'posY_5', 'velX_5', 'velY_5', 'accX_5', 'accY_5', 'feaLla_5', 'feaMon_5', 'feaSpr_5', 'resAir_5', 'resVel_5', 'resMon_5', 'pulse_5', 'neighbour_5', 'state_5', 'stageKms_5', 'stageAngle_5', 'pendingKms_5', 'pendingAngle_5', 'remainderOverallTime_5', 'remainderActualTime_5', 'leader_5','innovador_5','metodico_5','gregario_5', 'inquieto_5',
    'posX_6', 'posY_6', 'velX_6', 'velY_6', 'accX_6', 'accY_6', 'feaLla_6', 'feaMon_6', 'feaSpr_6', 'resAir_6', 'resVel_6', 'resMon_6', 'pulse_6', 'neighbour_6', 'state_6', 'stageKms_6', 'stageAngle_6', 'pendingKms_6', 'pendingAngle_6', 'remainderOverallTime_6', 'remainderActualTime_6', 'leader_6','innovador_6','metodico_6','gregario_6', 'inquieto_6',
    'profile_0','profile_1','profile_2','profile_3','profile_4','profile_5','profile_6','profile_7','profile_8','profile_9',
    'profile_10','profile_11','profile_12','profile_13','profile_14','profile_15','profile_16','profile_17','profile_18','profile_19',
    'profile_20','profile_21','profile_22','profile_23','profile_24','profile_25','profile_26','profile_27','profile_28','profile_29',
    'profile_30','profile_31','profile_32','profile_33','profile_34','profile_35','profile_36','profile_37','profile_38','profile_39',
    'profile_40','profile_41','profile_42','profile_43','profile_44','profile_45','profile_46','profile_47','profile_48','profile_49',
    'profile_50','profile_51','profile_52','profile_53','profile_54','profile_55','profile_56','profile_57','profile_58','profile_59',

    'other_posX_0', 'other_posY_0', 'other_velX_0', 'other_velY_0', 'other_accX_0', 'other_accY_0', 'other_feaLla_0', 'other_feaMon_0', 'other_feaSpr_0', 'other_state_0',
    'other_posX_1', 'other_posY_1', 'other_velX_1', 'other_velY_1', 'other_accX_1', 'other_accY_1', 'other_feaLla_1', 'other_feaMon_1', 'other_feaSpr_1', 'other_state_1',
    'other_posX_2', 'other_posY_2', 'other_velX_2', 'other_velY_2', 'other_accX_2', 'other_accY_2', 'other_feaLla_2', 'other_feaMon_2', 'other_feaSpr_2', 'other_state_2',
    'other_posX_3', 'other_posY_3', 'other_velX_3', 'other_velY_3', 'other_accX_3', 'other_accY_3', 'other_feaLla_3', 'other_feaMon_3', 'other_feaSpr_3', 'other_state_3',
    'other_posX_4', 'other_posY_4', 'other_velX_4', 'other_velY_4', 'other_accX_4', 'other_accY_4', 'other_feaLla_4', 'other_feaMon_4', 'other_feaSpr_4', 'other_state_4',
    'other_posX_5', 'other_posY_5', 'other_velX_5', 'other_velY_5', 'other_accX_5', 'other_accY_5', 'other_feaLla_5', 'other_feaMon_5', 'other_feaSpr_5', 'other_state_5',
    'other_posX_6', 'other_posY_6', 'other_velX_6', 'other_velY_6', 'other_accX_6', 'other_accY_6', 'other_feaLla_6', 'other_feaMon_6', 'other_feaSpr_6', 'other_state_6',
    'other_posX_7', 'other_posY_7', 'other_velX_7', 'other_velY_7', 'other_accX_7', 'other_accY_7', 'other_feaLla_7', 'other_feaMon_7', 'other_feaSpr_7', 'other_state_7',
    'other_posX_8', 'other_posY_8', 'other_velX_8', 'other_velY_8', 'other_accX_8', 'other_accY_8', 'other_feaLla_8', 'other_feaMon_8', 'other_feaSpr_8', 'other_state_8',
    'other_posX_9', 'other_posY_9', 'other_velX_9', 'other_velY_9', 'other_accX_9', 'other_accY_9', 'other_feaLla_9', 'other_feaMon_9', 'other_feaSpr_9', 'other_state_9',

    'other_posX_10', 'other_posY_10', 'other_velX_10', 'other_velY_10', 'other_accX_10', 'other_accY_10', 'other_feaLla_10', 'other_feaMon_10', 'other_feaSpr_10', 'other_state_10',
    'other_posX_11', 'other_posY_11', 'other_velX_11', 'other_velY_11', 'other_accX_11', 'other_accY_11', 'other_feaLla_11', 'other_feaMon_11', 'other_feaSpr_11', 'other_state_11',
    'other_posX_12', 'other_posY_12', 'other_velX_12', 'other_velY_12', 'other_accX_12', 'other_accY_12', 'other_feaLla_12', 'other_feaMon_12', 'other_feaSpr_12', 'other_state_12',
    'other_posX_13', 'other_posY_13', 'other_velX_13', 'other_velY_13', 'other_accX_13', 'other_accY_13', 'other_feaLla_13', 'other_feaMon_13', 'other_feaSpr_13', 'other_state_13',
    'other_posX_14', 'other_posY_14', 'other_velX_14', 'other_velY_14', 'other_accX_14', 'other_accY_14', 'other_feaLla_14', 'other_feaMon_14', 'other_feaSpr_14', 'other_state_14',
    'other_posX_15', 'other_posY_15', 'other_velX_15', 'other_velY_15', 'other_accX_15', 'other_accY_15', 'other_feaLla_15', 'other_feaMon_15', 'other_feaSpr_15', 'other_state_15',
    'other_posX_16', 'other_posY_16', 'other_velX_16', 'other_velY_16', 'other_accX_16', 'other_accY_16', 'other_feaLla_16', 'other_feaMon_16', 'other_feaSpr_16', 'other_state_16',
    'other_posX_17', 'other_posY_17', 'other_velX_17', 'other_velY_17', 'other_accX_17', 'other_accY_17', 'other_feaLla_17', 'other_feaMon_17', 'other_feaSpr_17', 'other_state_17',
    'other_posX_18', 'other_posY_18', 'other_velX_18', 'other_velY_18', 'other_accX_18', 'other_accY_18', 'other_feaLla_18', 'other_feaMon_18', 'other_feaSpr_18', 'other_state_18',
    'other_posX_19', 'other_posY_19', 'other_velX_19', 'other_velY_19', 'other_accX_19', 'other_accY_19', 'other_feaLla_19', 'other_feaMon_19', 'other_feaSpr_19', 'other_state_19',

    'other_posX_20', 'other_posY_20', 'other_velX_20', 'other_velY_20', 'other_accX_20', 'other_accY_20', 'other_feaLla_20', 'other_feaMon_20', 'other_feaSpr_20', 'other_state_20',
    'other_posX_21', 'other_posY_21', 'other_velX_21', 'other_velY_21', 'other_accX_21', 'other_accY_21', 'other_feaLla_21', 'other_feaMon_21', 'other_feaSpr_21', 'other_state_21',
    'other_posX_22', 'other_posY_22', 'other_velX_22', 'other_velY_22', 'other_accX_22', 'other_accY_22', 'other_feaLla_22', 'other_feaMon_22', 'other_feaSpr_22', 'other_state_22',
    'other_posX_23', 'other_posY_23', 'other_velX_23', 'other_velY_23', 'other_accX_23', 'other_accY_23', 'other_feaLla_23', 'other_feaMon_23', 'other_feaSpr_23', 'other_state_23',
    'other_posX_24', 'other_posY_24', 'other_velX_24', 'other_velY_24', 'other_accX_24', 'other_accY_24', 'other_feaLla_24', 'other_feaMon_24', 'other_feaSpr_24', 'other_state_24',
    'other_posX_25', 'other_posY_25', 'other_velX_25', 'other_velY_25', 'other_accX_25', 'other_accY_25', 'other_feaLla_25', 'other_feaMon_25', 'other_feaSpr_25', 'other_state_25',
    'other_posX_26', 'other_posY_26', 'other_velX_26', 'other_velY_26', 'other_accX_26', 'other_accY_26', 'other_feaLla_26', 'other_feaMon_26', 'other_feaSpr_26', 'other_state_26',
    'other_posX_27', 'other_posY_27', 'other_velX_27', 'other_velY_27', 'other_accX_27', 'other_accY_27', 'other_feaLla_27', 'other_feaMon_27', 'other_feaSpr_27', 'other_state_27',
    'other_posX_28', 'other_posY_28', 'other_velX_28', 'other_velY_28', 'other_accX_28', 'other_accY_28', 'other_feaLla_28', 'other_feaMon_28', 'other_feaSpr_28', 'other_state_28',
    'other_posX_29', 'other_posY_29', 'other_velX_29', 'other_velY_29', 'other_accX_29', 'other_accY_29', 'other_feaLla_29', 'other_feaMon_29', 'other_feaSpr_29', 'other_state_29',

    'other_posX_30', 'other_posY_30', 'other_velX_30', 'other_velY_30', 'other_accX_30', 'other_accY_30', 'other_feaLla_30', 'other_feaMon_30', 'other_feaSpr_30', 'other_state_30',
    'other_posX_31', 'other_posY_31', 'other_velX_31', 'other_velY_31', 'other_accX_31', 'other_accY_31', 'other_feaLla_31', 'other_feaMon_31', 'other_feaSpr_31', 'other_state_31',
    'other_posX_32', 'other_posY_32', 'other_velX_32', 'other_velY_32', 'other_accX_32', 'other_accY_32', 'other_feaLla_32', 'other_feaMon_32', 'other_feaSpr_32', 'other_state_32',
    'other_posX_33', 'other_posY_33', 'other_velX_33', 'other_velY_33', 'other_accX_33', 'other_accY_33', 'other_feaLla_33', 'other_feaMon_33', 'other_feaSpr_33', 'other_state_33',
    'other_posX_34', 'other_posY_34', 'other_velX_34', 'other_velY_34', 'other_accX_34', 'other_accY_34', 'other_feaLla_34', 'other_feaMon_34', 'other_feaSpr_34', 'other_state_34',
    'other_posX_35', 'other_posY_35', 'other_velX_35', 'other_velY_35', 'other_accX_35', 'other_accY_35', 'other_feaLla_35', 'other_feaMon_35', 'other_feaSpr_35', 'other_state_35',
    'other_posX_36', 'other_posY_36', 'other_velX_36', 'other_velY_36', 'other_accX_36', 'other_accY_36', 'other_feaLla_36', 'other_feaMon_36', 'other_feaSpr_36', 'other_state_36',
    'other_posX_37', 'other_posY_37', 'other_velX_37', 'other_velY_37', 'other_accX_37', 'other_accY_37', 'other_feaLla_37', 'other_feaMon_37', 'other_feaSpr_37', 'other_state_37',
    'other_posX_38', 'other_posY_38', 'other_velX_38', 'other_velY_38', 'other_accX_38', 'other_accY_38', 'other_feaLla_38', 'other_feaMon_38', 'other_feaSpr_38', 'other_state_38',
    'other_posX_39', 'other_posY_39', 'other_velX_39', 'other_velY_39', 'other_accX_39', 'other_accY_39', 'other_feaLla_39', 'other_feaMon_39', 'other_feaSpr_39', 'other_state_39',

    'other_posX_40', 'other_posY_40', 'other_velX_40', 'other_velY_40', 'other_accX_40', 'other_accY_40', 'other_feaLla_40', 'other_feaMon_40', 'other_feaSpr_40', 'other_state_40',
    'other_posX_41', 'other_posY_41', 'other_velX_41', 'other_velY_41', 'other_accX_41', 'other_accY_41', 'other_feaLla_41', 'other_feaMon_41', 'other_feaSpr_41', 'other_state_41',
    'other_posX_42', 'other_posY_42', 'other_velX_42', 'other_velY_42', 'other_accX_42', 'other_accY_42', 'other_feaLla_42', 'other_feaMon_42', 'other_feaSpr_42', 'other_state_42',
    'other_posX_43', 'other_posY_43', 'other_velX_43', 'other_velY_43', 'other_accX_43', 'other_accY_43', 'other_feaLla_43', 'other_feaMon_43', 'other_feaSpr_43', 'other_state_43',
    'other_posX_44', 'other_posY_44', 'other_velX_44', 'other_velY_44', 'other_accX_44', 'other_accY_44', 'other_feaLla_44', 'other_feaMon_44', 'other_feaSpr_44', 'other_state_44',
    'other_posX_45', 'other_posY_45', 'other_velX_45', 'other_velY_45', 'other_accX_45', 'other_accY_45', 'other_feaLla_45', 'other_feaMon_45', 'other_feaSpr_45', 'other_state_45',
    'other_posX_46', 'other_posY_46', 'other_velX_46', 'other_velY_46', 'other_accX_46', 'other_accY_46', 'other_feaLla_46', 'other_feaMon_46', 'other_feaSpr_46', 'other_state_46',
    'other_posX_47', 'other_posY_47', 'other_velX_47', 'other_velY_47', 'other_accX_47', 'other_accY_47', 'other_feaLla_47', 'other_feaMon_47', 'other_feaSpr_47', 'other_state_47',
    'other_posX_48', 'other_posY_48', 'other_velX_48', 'other_velY_48', 'other_accX_48', 'other_accY_48', 'other_feaLla_48', 'other_feaMon_48', 'other_feaSpr_48', 'other_state_48',
    'other_posX_49', 'other_posY_49', 'other_velX_49', 'other_velY_49', 'other_accX_49', 'other_accY_49', 'other_feaLla_49', 'other_feaMon_49', 'other_feaSpr_49', 'other_state_49',

    'other_posX_50', 'other_posY_50', 'other_velX_50', 'other_velY_50', 'other_accX_50', 'other_accY_50', 'other_feaLla_50', 'other_feaMon_50', 'other_feaSpr_50', 'other_state_50',
    'other_posX_51', 'other_posY_51', 'other_velX_51', 'other_velY_51', 'other_accX_51', 'other_accY_51', 'other_feaLla_51', 'other_feaMon_51', 'other_feaSpr_51', 'other_state_51',
    'other_posX_52', 'other_posY_52', 'other_velX_52', 'other_velY_52', 'other_accX_52', 'other_accY_52', 'other_feaLla_52', 'other_feaMon_52', 'other_feaSpr_52', 'other_state_52',
    'other_posX_53', 'other_posY_53', 'other_velX_53', 'other_velY_53', 'other_accX_53', 'other_accY_53', 'other_feaLla_53', 'other_feaMon_53', 'other_feaSpr_53', 'other_state_53',
    'other_posX_54', 'other_posY_54', 'other_velX_54', 'other_velY_54', 'other_accX_54', 'other_accY_54', 'other_feaLla_54', 'other_feaMon_54', 'other_feaSpr_54', 'other_state_54',
    'other_posX_55', 'other_posY_55', 'other_velX_55', 'other_velY_55', 'other_accX_55', 'other_accY_55', 'other_feaLla_55', 'other_feaMon_55', 'other_feaSpr_55', 'other_state_55',
    'other_posX_56', 'other_posY_56', 'other_velX_56', 'other_velY_56', 'other_accX_56', 'other_accY_56', 'other_feaLla_56', 'other_feaMon_56', 'other_feaSpr_56', 'other_state_56',
    'other_posX_57', 'other_posY_57', 'other_velX_57', 'other_velY_57', 'other_accX_57', 'other_accY_57', 'other_feaLla_57', 'other_feaMon_57', 'other_feaSpr_57', 'other_state_57',
    'other_posX_58', 'other_posY_58', 'other_velX_58', 'other_velY_58', 'other_accX_58', 'other_accY_58', 'other_feaLla_58', 'other_feaMon_58', 'other_feaSpr_58', 'other_state_58',
    'other_posX_59', 'other_posY_59', 'other_velX_59', 'other_velY_59', 'other_accX_59', 'other_accY_59', 'other_feaLla_59', 'other_feaMon_59', 'other_feaSpr_59', 'other_state_59',

    'other_posX_60', 'other_posY_60', 'other_velX_60', 'other_velY_60', 'other_accX_60', 'other_accY_60', 'other_feaLla_60', 'other_feaMon_60', 'other_feaSpr_60', 'other_state_60',
    'other_posX_61', 'other_posY_61', 'other_velX_61', 'other_velY_61', 'other_accX_61', 'other_accY_61', 'other_feaLla_61', 'other_feaMon_61', 'other_feaSpr_61', 'other_state_61',
    'other_posX_62', 'other_posY_62', 'other_velX_62', 'other_velY_62', 'other_accX_62', 'other_accY_62', 'other_feaLla_62', 'other_feaMon_62', 'other_feaSpr_62', 'other_state_62',
    'other_posX_63', 'other_posY_63', 'other_velX_63', 'other_velY_63', 'other_accX_63', 'other_accY_63', 'other_feaLla_63', 'other_feaMon_63', 'other_feaSpr_63', 'other_state_63',
    'other_posX_64', 'other_posY_64', 'other_velX_64', 'other_velY_64', 'other_accX_64', 'other_accY_64', 'other_feaLla_64', 'other_feaMon_64', 'other_feaSpr_64', 'other_state_64',
    'other_posX_65', 'other_posY_65', 'other_velX_65', 'other_velY_65', 'other_accX_65', 'other_accY_65', 'other_feaLla_65', 'other_feaMon_65', 'other_feaSpr_65', 'other_state_65',
    'other_posX_66', 'other_posY_66', 'other_velX_66', 'other_velY_66', 'other_accX_66', 'other_accY_66', 'other_feaLla_66', 'other_feaMon_66', 'other_feaSpr_66', 'other_state_66',
    'other_posX_67', 'other_posY_67', 'other_velX_67', 'other_velY_67', 'other_accX_67', 'other_accY_67', 'other_feaLla_67', 'other_feaMon_67', 'other_feaSpr_67', 'other_state_67',
    'other_posX_68', 'other_posY_68', 'other_velX_68', 'other_velY_68', 'other_accX_68', 'other_accY_68', 'other_feaLla_68', 'other_feaMon_68', 'other_feaSpr_68', 'other_state_68',
    'other_posX_69', 'other_posY_69', 'other_velX_69', 'other_velY_69', 'other_accX_69', 'other_accY_69', 'other_feaLla_69', 'other_feaMon_69', 'other_feaSpr_69', 'other_state_69',

    'other_posX_70', 'other_posY_70', 'other_velX_70', 'other_velY_70', 'other_accX_70', 'other_accY_70', 'other_feaLla_70', 'other_feaMon_70', 'other_feaSpr_70', 'other_state_70',
    'other_posX_71', 'other_posY_71', 'other_velX_71', 'other_velY_71', 'other_accX_71', 'other_accY_71', 'other_feaLla_71', 'other_feaMon_71', 'other_feaSpr_71', 'other_state_71',
    'other_posX_72', 'other_posY_72', 'other_velX_72', 'other_velY_72', 'other_accX_72', 'other_accY_72', 'other_feaLla_72', 'other_feaMon_72', 'other_feaSpr_72', 'other_state_72',
    'other_posX_73', 'other_posY_73', 'other_velX_73', 'other_velY_73', 'other_accX_73', 'other_accY_73', 'other_feaLla_73', 'other_feaMon_73', 'other_feaSpr_73', 'other_state_73',
    'other_posX_74', 'other_posY_74', 'other_velX_74', 'other_velY_74', 'other_accX_74', 'other_accY_74', 'other_feaLla_74', 'other_feaMon_74', 'other_feaSpr_74', 'other_state_74',
    'other_posX_75', 'other_posY_75', 'other_velX_75', 'other_velY_75', 'other_accX_75', 'other_accY_75', 'other_feaLla_75', 'other_feaMon_75', 'other_feaSpr_75', 'other_state_75',
    'other_posX_76', 'other_posY_76', 'other_velX_76', 'other_velY_76', 'other_accX_76', 'other_accY_76', 'other_feaLla_76', 'other_feaMon_76', 'other_feaSpr_76', 'other_state_76',
    'other_posX_77', 'other_posY_77', 'other_velX_77', 'other_velY_77', 'other_accX_77', 'other_accY_77', 'other_feaLla_77', 'other_feaMon_77', 'other_feaSpr_77', 'other_state_77',
    'other_posX_78', 'other_posY_78', 'other_velX_78', 'other_velY_78', 'other_accX_78', 'other_accY_78', 'other_feaLla_78', 'other_feaMon_78', 'other_feaSpr_78', 'other_state_78',
    'other_posX_79', 'other_posY_79', 'other_velX_79', 'other_velY_79', 'other_accX_79', 'other_accY_79', 'other_feaLla_79', 'other_feaMon_79', 'other_feaSpr_79', 'other_state_79',

    'other_posX_80', 'other_posY_80', 'other_velX_80', 'other_velY_80', 'other_accX_80', 'other_accY_80', 'other_feaLla_80', 'other_feaMon_80', 'other_feaSpr_80', 'other_state_80',
    'other_posX_81', 'other_posY_81', 'other_velX_81', 'other_velY_81', 'other_accX_81', 'other_accY_81', 'other_feaLla_81', 'other_feaMon_81', 'other_feaSpr_81', 'other_state_81',
    'other_posX_82', 'other_posY_82', 'other_velX_82', 'other_velY_82', 'other_accX_82', 'other_accY_82', 'other_feaLla_82', 'other_feaMon_82', 'other_feaSpr_82', 'other_state_82',
    'other_posX_83', 'other_posY_83', 'other_velX_83', 'other_velY_83', 'other_accX_83', 'other_accY_83', 'other_feaLla_83', 'other_feaMon_83', 'other_feaSpr_83', 'other_state_83',
    'other_posX_84', 'other_posY_84', 'other_velX_84', 'other_velY_84', 'other_accX_84', 'other_accY_84', 'other_feaLla_84', 'other_feaMon_84', 'other_feaSpr_84', 'other_state_84',
    'other_posX_85', 'other_posY_85', 'other_velX_85', 'other_velY_85', 'other_accX_85', 'other_accY_85', 'other_feaLla_85', 'other_feaMon_85', 'other_feaSpr_85', 'other_state_85',
    'other_posX_86', 'other_posY_86', 'other_velX_86', 'other_velY_86', 'other_accX_86', 'other_accY_86', 'other_feaLla_86', 'other_feaMon_86', 'other_feaSpr_86', 'other_state_86',
    'other_posX_87', 'other_posY_87', 'other_velX_87', 'other_velY_87', 'other_accX_87', 'other_accY_87', 'other_feaLla_87', 'other_feaMon_87', 'other_feaSpr_87', 'other_state_87',
    'other_posX_88', 'other_posY_88', 'other_velX_88', 'other_velY_88', 'other_accX_88', 'other_accY_88', 'other_feaLla_88', 'other_feaMon_88', 'other_feaSpr_88', 'other_state_88',
    'other_posX_89', 'other_posY_89', 'other_velX_89', 'other_velY_89', 'other_accX_89', 'other_accY_89', 'other_feaLla_89', 'other_feaMon_89', 'other_feaSpr_89', 'other_state_89',

    'other_posX_90', 'other_posY_90', 'other_velX_90', 'other_velY_90', 'other_accX_90', 'other_accY_90', 'other_feaLla_90', 'other_feaMon_90', 'other_feaSpr_90', 'other_state_90',
    'other_posX_91', 'other_posY_91', 'other_velX_91', 'other_velY_91', 'other_accX_91', 'other_accY_91', 'other_feaLla_91', 'other_feaMon_91', 'other_feaSpr_91', 'other_state_91',
    'other_posX_92', 'other_posY_92', 'other_velX_92', 'other_velY_92', 'other_accX_92', 'other_accY_92', 'other_feaLla_92', 'other_feaMon_92', 'other_feaSpr_92', 'other_state_92',
    'other_posX_93', 'other_posY_93', 'other_velX_93', 'other_velY_93', 'other_accX_93', 'other_accY_93', 'other_feaLla_93', 'other_feaMon_93', 'other_feaSpr_93', 'other_state_93',
    'other_posX_94', 'other_posY_94', 'other_velX_94', 'other_velY_94', 'other_accX_94', 'other_accY_94', 'other_feaLla_94', 'other_feaMon_94', 'other_feaSpr_94', 'other_state_94',
    'other_posX_95', 'other_posY_95', 'other_velX_95', 'other_velY_95', 'other_accX_95', 'other_accY_95', 'other_feaLla_95', 'other_feaMon_95', 'other_feaSpr_95', 'other_state_95',
    'other_posX_96', 'other_posY_96', 'other_velX_96', 'other_velY_96', 'other_accX_96', 'other_accY_96', 'other_feaLla_96', 'other_feaMon_96', 'other_feaSpr_96', 'other_state_96',
    'other_posX_97', 'other_posY_97', 'other_velX_97', 'other_velY_97', 'other_accX_97', 'other_accY_97', 'other_feaLla_97', 'other_feaMon_97', 'other_feaSpr_97', 'other_state_97',
    'other_posX_98', 'other_posY_98', 'other_velX_98', 'other_velY_98', 'other_accX_98', 'other_accY_98', 'other_feaLla_98', 'other_feaMon_98', 'other_feaSpr_98', 'other_state_98',
    'other_posX_99', 'other_posY_99', 'other_velX_99', 'other_velY_99', 'other_accX_99', 'other_accY_99', 'other_feaLla_99', 'other_feaMon_99', 'other_feaSpr_99', 'other_state_99',

  ], { delimiter: ',' }),
  transports: [
    new transports.File({ filename: (process.env.LOG_PATH_TEAM === undefined)? 'tmp/dataTeam.csv' : process.env.LOG_PATH_TEAM }),
  ],
});

class Team {
    static _id = 0;
    
    constructor() {
      this.cyclists =[];
      this.strategy = 0;
      this.id = Team._id++;
    }
    
    addCyclist(item) {
      this.cyclists.push(item);
      item.team = this;
    }
    
    computeMedium() {

      var medium = {montana: 0, llano: 0 ,sprint: 0};
      var counter = 0;

      for (var cyclist of this.cyclists) {
        medium.montana += cyclist.montana;
        medium.llano += cyclist.llano;
        medium.sprint += cyclist.sprint;

        counter++;
      }

      medium.montana /= counter;
      medium.llano /= counter;
      medium.sprint /= counter;

      this.medium=medium;
    }

    _identifyOthers() {

      let set = new Set();
      for (var cyclist of this.cyclists) {
        set.add(cyclist.id);
      }

      let aux = this.full_cyclists.slice(0);

      for (var i=this.full_cyclists.length-1; i >= 0; i--) {
        if (set.has(this.full_cyclists[i].id)) {
          aux.splice(i, 1);
        }
      }

      this.full_cyclists = aux;
    }
    
    build(stage) {
      var profile = stage.profile
      this.full_cyclists = stage.cyclists.slice(0);
      this.profile = profile;
      console.log("building team " + this.id);

      this.planner = new Planner(this, stage);
      this.planner.init();

      this._identifyOthers();

      
      var profileType=profile.getType();
      var actors = StageUtils.computeMainActors(profileType, stage.cyclists);

      this.sortCyclists();
      this.computeStatistics();

      let leader = this.cyclists[0];
      if (this.id == 0) return;
      
      if (leader.energy.llano > 80
          && leader.energy.montana > 80) {
        this.strategy = 1;
        this.leader = leader;
        
        this._buildStrategy1();
      } else {
        this.cyclists.forEach(item => {
          if (item.energy.llano > 75 
            && item.energy.montana >
                  this.medium.montana * 1.2
            && item.energy.estadoForma > 95) {
            this.buildStrategy2(item);
          } else if (item.energy.montana > 
                  this.medium.montana*1.1){
            this.buildStrategy3(item);
          }
        });
      }
    }
    
    buildStrategy3(item){
      console.log(''+item.number+ ' esta atento'); 
      item.addAction({
        from: 2000,
        to: 3000,
        prob: 70,
        action: 'avanza',
        payload: 90
      });
    }
    
    buildStrategy2(item) {
      console.log(''+item.number+' debe saltar')
      item.addAction({
        from: 2000,
        to: 3000,
        prob: 90,
        action: 'avanza',
        payload: 90
      })
      item.addAction({
        from: 18050,
        to: 20250,
        prob: 55,
        action: 'salta',
        payload:''
      });
    }
    
    sortCyclists() {
      this.montana=this.cyclists.slice(0);
      this.llano=this.cyclists.slice(0);
      
      this.montana.sort((a,b) => {
        return - a.energy.montana + b.energy.montana
      });
      
      this.llano.sort((a,b)=> {
        return - a.energy.llano + b.energy.llano
      })
    }

    computeStatistics() {
      var avgMontana = this.montana.reduce(function (sum, item) {
        return sum + item.energy.montana;
      }, 0) / this.montana.length;

      var avgLlano = this.llano.reduce(function (sum, item) {
        return sum + item.energy.llano;
      }, 0) / this.llano.length;

      for (var i = 0; i < this.cyclists.length; i++) {
        var cyclist = this.cyclists[i];

        var leader = 60 + Math.random() * 10;
        var innovador = 60 + Math.random() * 10;
        var metodico = 70 + Math.random() * 20;
        var gregario = 70 + Math.random() * 20;

        if (i==0) {
          var monIndex = this.montana.indexOf(cyclist);
          if (monIndex == 0) {
            leader = 85 + Math.random() * 10;
            innovador = 85 + Math.random() * 10;
          } else if (cyclist.energy.montana > avgMontana) {
            leader = 75 + Math.random() * 10;
            innovador = 75 + Math.random() * 10;
          } else {
            leader = 65 + Math.random() * 10;
            innovador = 65 + Math.random() * 10;
          }
        }

        cyclist.setPsicology(leader, innovador, metodico, gregario);
      }
    }

    _buildStrategy1() {
      console.log('team ' + this.id);
      console.log(' leader.number '+ this.leader.number);

      var montana = this.montana.slice(0);
      var llano = this.llano.slice(0);

      
      var leaderMont = montana.indexOf(this.leader);
      var leaderLlano = llano.indexOf(this.leader);
      
      montana.splice(leaderMont, 1);
      llano.splice(leaderLlano, 1);
      
      this.escolta = this.montana[0];
      this.escolta.setPsicology(75, 65, 80, 70)
      
      console.log('im the ' + leaderMont);
      for (var i = 0; i < 3; i++){
        var index = llano.indexOf(this.montana[i]);
        llano.splice(index, 1);
      }
      
      llano[2].addAction({
        from: 0,
        to: 500,
        prob: 90,
        action: 'tira',
        payload: 50
      });
      llano[2].addAction({
        from: 2500,
        prob: 100,
        action: 'no_tira',
        payload: 80
      });
      llano[1].addAction({
        from: 100,
        to: 500,
        prob: 90,
        action: 'avanza',
        payload: 80
      });
      llano[1].addAction({
        from: 2500,
        to: 3000,
        prob: 90,
        action: 'tira',
        payload: 70
      });
      this.leader.addAction({
        from: 1500,
        to: 2000,
        prob: 75,
        action: 'avanza',
        payload: 80
      });
      this.escolta.addAction({
        from: 200,
        to: 250,
        prob: 85,
        action: 'protege',
        payload: this.leader.id
      });
    }
    
    update_strategy_1(stage) {
      var globalFirst=stage.getFirst();

      if (Math.random() < 0.001) {
          let diff = globalFirst.position.x - this.leader.position.x;
          if (diff > 15) {
            this.leader.sendMessage('acelera#1');
          }
        }
    }
    
    update(stage) {
      // this.logTeam();

      if (Math.random() > 0.8) 
        this.planner.update(stage);

      switch (this.strategy) {
        case 1:
          this.update_strategy_1(stage);
          break;
        case 2:
        case 3:
        default:
      }
    }

    computeLogInfo() {
      this.jsonMessage = {};

      for (var i=0;i < this.cyclists.length; i++) {
        this.jsonMessage['posX_'+ i] = Utils.dec(this.cyclists[i].position.x, 2);
        this.jsonMessage['posY_'+ i] = Utils.dec(this.cyclists[i].position.y, 2);
        this.jsonMessage['velX_'+i] = Utils.dec(this.cyclists[i].velocity.x, 2);
        this.jsonMessage['velY_'+i] = Utils.dec(this.cyclists[i].velocity.y, 2);
        this.jsonMessage['accX_'+i] = Utils.dec(this.cyclists[i].acceleration.x, 2);
        this.jsonMessage['accY_'+i] = Utils.dec(this.cyclists[i].acceleration.y, 2);
        this.jsonMessage['feaLla_'+i] = Utils.dec(this.cyclists[i].energy.llano, 2);
        this.jsonMessage['feaMon_'+i] = Utils.dec(this.cyclists[i].energy.montana, 2);
        this.jsonMessage['feaSpr_'+i] = Utils.dec(this.cyclists[i].energy.sprint, 2);
        this.jsonMessage['pulse_'+i] =  Utils.dec(this.cyclists[i].energy.pulse2, 2);
        this.jsonMessage['neighbour_'+i] =  this.cyclists[i].neighbour.length;
        this.jsonMessage['state_'+i] =  this.cyclists[i]._stateMachine[0].value;
        this.jsonMessage['leader_'+i] = Utils.dec(this.cyclists[i].psicology.leader, 2);
        this.jsonMessage['innovador_'+i] = Utils.dec(this.cyclists[i].psicology.innovador, 2);
        this.jsonMessage['metodico_'+i] = Utils.dec(this.cyclists[i].psicology.metodico, 2);
        this.jsonMessage['gregario_'+i] = Utils.dec(this.cyclists[i].psicology.gregario, 2);
        this.jsonMessage['inquieto_'+i] = Utils.dec(this.cyclists[i].inquieto, 2);
      }

      for (var i = 0; i < 60; /*this.profile.etapa.length;*/ i++) {
        if (i < this.profile.etapa.length) {
          this.jsonMessage['profile_'+i] = this.profile.etapa[i];
        } else {
          this.jsonMessage['profile_'+i] = 0;
        }
      }

      for (var i=0; i < this.full_cyclists.length; i++) {
        this.jsonMessage['other_posX_'+ i] = Utils.dec(this.full_cyclists[i].position.x, 2);
        this.jsonMessage['other_posY_'+ i] = Utils.dec(this.full_cyclists[i].position.y, 2);
        this.jsonMessage['other_velX_'+i] = Utils.dec(this.full_cyclists[i].velocity.x, 2);
        this.jsonMessage['other_velY_'+i] = Utils.dec(this.full_cyclists[i].velocity.y, 2);
        this.jsonMessage['other_accX_'+i] = Utils.dec(this.full_cyclists[i].acceleration.x, 2);
        this.jsonMessage['other_accY_'+i] = Utils.dec(this.full_cyclists[i].acceleration.y, 2);
        this.jsonMessage['other_feaLla_'+i] = Utils.dec(this.full_cyclists[i].energy.llano, 2);
        this.jsonMessage['other_feaMon_'+i] = Utils.dec(this.full_cyclists[i].energy.montana, 2);
        this.jsonMessage['other_feaSpr_'+i] = Utils.dec(this.full_cyclists[i].energy.sprint, 2);
        this.jsonMessage['other_state_'+i] =  this.full_cyclists[i]._stateMachine[0].value;
      }
    }

    logTeam() {
      if (this.jsonMessage === undefined) {
        this.computeLogInfo();
      }

      for (var i=0;i < this.cyclists.length; i++) {
        this.jsonMessage['posX_'+ i] = Utils.dec(this.cyclists[i].position.x, 2);
        this.jsonMessage['posY_'+ i] = Utils.dec(this.cyclists[i].position.y, 2);
        this.jsonMessage['velX_'+i] = Utils.dec(this.cyclists[i].velocity.x, 2);
        this.jsonMessage['velY_'+i] = Utils.dec(this.cyclists[i].velocity.y, 2);
        this.jsonMessage['accX_'+i] = Utils.dec(this.cyclists[i].acceleration.x, 2);
        this.jsonMessage['accY_'+i] = Utils.dec(this.cyclists[i].acceleration.y, 2);
        this.jsonMessage['pulse_'+i] =  Utils.dec(this.cyclists[i].energy.pulse2, 2);
        this.jsonMessage['neighbour_'+i] =  this.cyclists[i].neighbour.length;
        this.jsonMessage['state_'+i] =  this.cyclists[i]._stateMachine[0].value;
        /*jsonMessage['stageKms_'+i] =  Utils.dec(profileStatistics.stageKms, 2);
        jsonMessage['stageAngle_'+i] =  Utils.dec(profileStatistics.stageAngle, 2);
        jsonMessage['pendingKms_'+i] = Utils.dec(profileStatistics.pendingKms, 2);
        jsonMessage['pendingAngle_'+i] = Utils.dec(profileStatistics.pendingAngle, 2);
        jsonMessage['remainderOverallTime_'+i] = Utils.dec(this.stage.profile.tiempoExpected - this.stage.timestamp, 2);
        jsonMessage['remainderActualTime_'+i] = Utils.dec(this.tiempoExpected - this.stage.timestamp, 2);*/
        this.jsonMessage['leader_'+i] = Utils.dec(this.cyclists[i].psicology.leader, 2);
        this.jsonMessage['innovador_'+i] = Utils.dec(this.cyclists[i].psicology.innovador, 2);
        this.jsonMessage['metodico_'+i] = Utils.dec(this.cyclists[i].psicology.metodico, 2);
        this.jsonMessage['gregario_'+i] = Utils.dec(this.cyclists[i].psicology.gregario, 2);
        this.jsonMessage['inquieto_'+i] = Utils.dec(this.cyclists[i].inquieto, 2);
    }

    for (var i=0; i < this.full_cyclists.length; i++) {
      this.jsonMessage['other_posX_'+ i] = Utils.dec(this.full_cyclists[i].position.x, 2);
      this.jsonMessage['other_posY_'+ i] = Utils.dec(this.full_cyclists[i].position.y, 2);
      this.jsonMessage['other_velX_'+i] = Utils.dec(this.full_cyclists[i].velocity.x, 2);
      this.jsonMessage['other_velY_'+i] = Utils.dec(this.full_cyclists[i].velocity.y, 2);
      this.jsonMessage['other_accX_'+i] = Utils.dec(this.full_cyclists[i].acceleration.x, 2);
      this.jsonMessage['other_accY_'+i] = Utils.dec(this.full_cyclists[i].acceleration.y, 2);
      this.jsonMessage['other_state_'+i] =  this.full_cyclists[i]._stateMachine[0].value;
    }

      dataLogger.log('info', this.jsonMessage);
    }
  }


  module.exports = Team