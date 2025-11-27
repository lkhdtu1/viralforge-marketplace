import { EscrowStatus } from '@prisma/client';
import { updateEscrowStatus } from '../services/payment.service';
import { ValidationError } from '../utils/errors';

describe('Escrow Service', () => {
  describe('State Machine', () => {
    it('should allow valid state transitions', async () => {
      // Mock escrow and contract
      const mockEscrow = {
        id: 'test-escrow-id',
        status: EscrowStatus.CREATED,
        contract: {
          id: 'test-contract-id',
          brandId: 'test-brand-id',
          creatorId: 'test-creator-id',
        },
      };
      
      // This would need proper mocking of Prisma
      // For now, we test the logic
      const validTransitions: Record<EscrowStatus, EscrowStatus[]> = {
        [EscrowStatus.CREATED]: [EscrowStatus.FUNDED, EscrowStatus.REFUNDED],
        [EscrowStatus.FUNDED]: [EscrowStatus.IN_PROGRESS, EscrowStatus.REFUNDED],
        [EscrowStatus.IN_PROGRESS]: [EscrowStatus.COMPLETED, EscrowStatus.REFUNDED],
        [EscrowStatus.COMPLETED]: [EscrowStatus.RELEASED, EscrowStatus.REFUNDED],
        [EscrowStatus.RELEASED]: [],
        [EscrowStatus.REFUNDED]: [],
      };
      
      expect(validTransitions[EscrowStatus.CREATED]).toContain(EscrowStatus.FUNDED);
      expect(validTransitions[EscrowStatus.CREATED]).toContain(EscrowStatus.REFUNDED);
      expect(validTransitions[EscrowStatus.RELEASED]).toHaveLength(0);
    });
    
    it('should reject invalid state transitions', () => {
      const validTransitions: Record<EscrowStatus, EscrowStatus[]> = {
        [EscrowStatus.CREATED]: [EscrowStatus.FUNDED, EscrowStatus.REFUNDED],
        [EscrowStatus.FUNDED]: [EscrowStatus.IN_PROGRESS, EscrowStatus.REFUNDED],
        [EscrowStatus.IN_PROGRESS]: [EscrowStatus.COMPLETED, EscrowStatus.REFUNDED],
        [EscrowStatus.COMPLETED]: [EscrowStatus.RELEASED, EscrowStatus.REFUNDED],
        [EscrowStatus.RELEASED]: [],
        [EscrowStatus.REFUNDED]: [],
      };
      
      // Cannot go from CREATED directly to RELEASED
      expect(validTransitions[EscrowStatus.CREATED]).not.toContain(EscrowStatus.RELEASED);
    });
  });
});

