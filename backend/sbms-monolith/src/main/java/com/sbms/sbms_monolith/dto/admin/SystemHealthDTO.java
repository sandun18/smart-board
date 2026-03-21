package com.sbms.sbms_monolith.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SystemHealthDTO {
    private int cpu;
    private int ram;
    private int storage;
}
