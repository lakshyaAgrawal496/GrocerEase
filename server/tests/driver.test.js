import { describe, it, expect, vi } from 'vitest';
import { updateDriverLocation } from '../controllers/driver.controller.js';
import DriverModel from '../models/driver.model.js';
import OrderModel from '../models/order.model.js';

vi.mock('../models/driver.model.js');
vi.mock('../models/order.model.js');

describe('Driver Controller', () => {
    it('should update location and emit socket event', async () => {
        const req = {
            body: { driverId: '123', lat: 10, lon: 20 },
            app: { get: vi.fn().mockReturnValue({ to: vi.fn().mockReturnValue({ emit: vi.fn() }) }) }
        };
        const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

        DriverModel.findByIdAndUpdate.mockResolvedValue({ _id: '123', currentLocation: { lat: 10, lon: 20 } });
        OrderModel.find.mockResolvedValue([{ _id: 'order1' }]);

        await updateDriverLocation(req, res);

        expect(DriverModel.findByIdAndUpdate).toHaveBeenCalledWith('123', expect.objectContaining({
            currentLocation: expect.objectContaining({ lat: 10, lon: 20 })
        }), { new: true });
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
});
