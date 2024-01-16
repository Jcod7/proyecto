"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarUbicacion = exports.crearUbicacion = exports.obtenerUbicacion = void 0;
const express_1 = __importDefault(require("express"));
const ubicacion_1 = __importDefault(require("../models/ubicacion"));
const app = (0, express_1.default)();
const obtenerUbicacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Ubicaciones = yield ubicacion_1.default.findAll();
        res.status(200).json(Ubicaciones);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener bicicleta ubicacion' });
    }
});
exports.obtenerUbicacion = obtenerUbicacion;
const crearUbicacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nuevaUbicacion = yield ubicacion_1.default.create(req.body);
        res.status(201).json(nuevaUbicacion);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear bicicleta' });
    }
});
exports.crearUbicacion = crearUbicacion;
const eliminarUbicacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { LocationID } = req.params;
    try {
        const ubicacion = yield ubicacion_1.default.findByPk(LocationID);
        if (ubicacion) {
            // Verificar que Bicicleta.sequelize no sea undefined antes de usarlo
            if (ubicacion_1.default.sequelize) {
                // Inicia una transacción manualmente
                const t = yield ubicacion_1.default.sequelize.transaction();
                try {
                    // Elimina la bicicleta de la tabla propietarioBicicleta dentro de la transacción
                    yield ubicacion_1.default.destroy({ where: { LocationID: ubicacion.getDataValue('LocationID') }, transaction: t });
                    // Luego, elimina la bicicleta de la tabla Bicicleta
                    yield ubicacion.destroy({ transaction: t });
                    // Hace commit de la transacción si todo fue exitoso
                    yield t.commit();
                    res.status(204).send();
                }
                catch (error) {
                    // En caso de error, realiza un rollback de la transacción
                    yield t.rollback();
                    res.status(500).json({ error: 'Error al eliminar ubicación' });
                }
            }
            else {
                res.status(500).json({ error: 'Error al obtener sequelize de ubicación' });
            }
        }
        else {
            res.status(404).json({ mensaje: 'Ubicación no encontrada' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error al eliminar ubicación' });
    }
});
exports.eliminarUbicacion = eliminarUbicacion;
