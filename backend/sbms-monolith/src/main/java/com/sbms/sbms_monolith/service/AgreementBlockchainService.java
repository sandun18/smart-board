package com.sbms.sbms_monolith.service;

import com.sbms.sbms_monolith.model.AgreementBlock;
import com.sbms.sbms_monolith.repository.AgreementBlockRepository;
import com.sbms.sbms_monolith.util.HashUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AgreementBlockchainService {

    @Autowired
    private AgreementBlockRepository blockRepo;

    // ================= ADD BLOCK =================

    public void addAgreementBlock(Long regId, String agreementHash) {

        AgreementBlock last =
                blockRepo.findTopByOrderByIdDesc().orElse(null);

        String previousHash =
                last != null ? last.getCurrentHash() : "GENESIS";

        String blockData =
                regId + agreementHash + previousHash;

        String currentHash =
                HashUtil.sha256(blockData);

        AgreementBlock block = new AgreementBlock();
        block.setRegistrationId(regId);
        block.setAgreementHash(agreementHash);
        block.setPreviousHash(previousHash);
        block.setCurrentHash(currentHash);
        block.setCreatedAt(java.time.LocalDateTime.now());

        blockRepo.save(block);
    }

    // ================= VALIDATE CHAIN =================

    public boolean validateChain() {

        List<AgreementBlock> blocks =
                blockRepo.findAllByOrderByIdAsc();

        if (blocks.isEmpty()) {
            return true; // empty chain is valid
        }

        for (int i = 1; i < blocks.size(); i++) {

            AgreementBlock current = blocks.get(i);
            AgreementBlock previous = blocks.get(i - 1);

            // 🔗 Validate hash linkage
            if (!current.getPreviousHash()
                    .equals(previous.getCurrentHash())) {
                return false;
            }

            // 🔐 Recalculate hash
            String recalculatedHash =
                    HashUtil.sha256(
                            current.getRegistrationId()
                                    + current.getAgreementHash()
                                    + current.getPreviousHash()
                    );

            if (!recalculatedHash
                    .equals(current.getCurrentHash())) {
                return false;
            }
        }

        return true;
    }
    
    public boolean validateBlock(Long registrationId) {

        AgreementBlock block = blockRepo
                .findByRegistrationId(registrationId)
                .orElse(null);

        if (block == null) {
            return false;
        }

        // 🔐 Recalculate current hash
        String recalculatedHash =
                HashUtil.sha256(
                        block.getRegistrationId()
                                + block.getAgreementHash()
                                + block.getPreviousHash()
                );

        if (!recalculatedHash.equals(block.getCurrentHash())) {
            return false;
        }

        // 🔗 Validate previous hash (if not genesis)
        if (!"GENESIS".equals(block.getPreviousHash())) {

            AgreementBlock previous =
                    blockRepo.findTopByIdLessThanOrderByIdDesc(
                            block.getId()
                    ).orElse(null);

            if (previous == null) {
                return false;
            }

            if (!block.getPreviousHash()
                    .equals(previous.getCurrentHash())) {
                return false;
            }
        }

        return true;
    }


}
