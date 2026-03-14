package com.sbms.sbms_monolith.service;

import com.sbms.sbms_monolith.dto.admin.AdminBoardingResponseDTO;
import com.sbms.sbms_monolith.dto.admin.AdminDashboardDTO;
import com.sbms.sbms_monolith.dto.admin.AdminReportResponseDTO;
import com.sbms.sbms_monolith.dto.admin.AdminUserResponseDTO;
import com.sbms.sbms_monolith.dto.admin.AnalyticsResponseDTO;
import com.sbms.sbms_monolith.dto.admin.ReportDecisionDTO;
import com.sbms.sbms_monolith.dto.admin.UserVerificationDTO;
import com.sbms.sbms_monolith.model.Boarding;
import com.sbms.sbms_monolith.model.Report;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.model.enums.ReportStatus;
import com.sbms.sbms_monolith.model.enums.Status;
import com.sbms.sbms_monolith.model.enums.UserRole;
import com.sbms.sbms_monolith.repository.AppointmentRepository;
import com.sbms.sbms_monolith.repository.BoardingRepository;
import com.sbms.sbms_monolith.repository.ChatMessageRepository;
import com.sbms.sbms_monolith.repository.ChatRoomRepository;
import com.sbms.sbms_monolith.repository.MaintenanceRepository;
import com.sbms.sbms_monolith.repository.MonthlyBillRepository;
import com.sbms.sbms_monolith.repository.OwnerWalletRepository;
import com.sbms.sbms_monolith.repository.OwnerWalletTransactionRepository;
import com.sbms.sbms_monolith.repository.RefreshTokenRepository;
import com.sbms.sbms_monolith.repository.RegistrationRepository;
import com.sbms.sbms_monolith.repository.ReportRepository;
import com.sbms.sbms_monolith.repository.ReviewRepository;
import com.sbms.sbms_monolith.repository.TechnicianReviewRepository;
import com.sbms.sbms_monolith.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.time.LocalDateTime;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    private static final int DEFAULT_ANALYTICS_DAYS = 30;
    private static final DateTimeFormatter ANALYTICS_LABEL_FORMATTER = DateTimeFormatter.ofPattern("MMM d");

    private final UserRepository userRepository;
    private final BoardingRepository boardingRepository;
    private final ReportRepository reportRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final ReviewRepository reviewRepository;
    private final RegistrationRepository registrationRepository;
    private final AppointmentRepository appointmentRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final MonthlyBillRepository monthlyBillRepository;
    private final TechnicianReviewRepository technicianReviewRepository;
    private final OwnerWalletRepository ownerWalletRepository;
    private final OwnerWalletTransactionRepository ownerWalletTransactionRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;

    public AdminServiceImpl(
            UserRepository userRepository,
            BoardingRepository boardingRepository,
            ReportRepository reportRepository,
            RefreshTokenRepository refreshTokenRepository,
            ReviewRepository reviewRepository,
            RegistrationRepository registrationRepository,
            AppointmentRepository appointmentRepository,
            MaintenanceRepository maintenanceRepository,
            MonthlyBillRepository monthlyBillRepository,
            TechnicianReviewRepository technicianReviewRepository,
            OwnerWalletRepository ownerWalletRepository,
            OwnerWalletTransactionRepository ownerWalletTransactionRepository,
            ChatRoomRepository chatRoomRepository,
            ChatMessageRepository chatMessageRepository
    ) {
        this.userRepository = userRepository;
        this.boardingRepository = boardingRepository;
        this.reportRepository = reportRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.reviewRepository = reviewRepository;
        this.registrationRepository = registrationRepository;
        this.appointmentRepository = appointmentRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.monthlyBillRepository = monthlyBillRepository;
        this.technicianReviewRepository = technicianReviewRepository;
        this.ownerWalletRepository = ownerWalletRepository;
        this.ownerWalletTransactionRepository = ownerWalletTransactionRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    // =========================================================
    // DASHBOARD
    // =========================================================
    @Override
    public AdminDashboardDTO getDashboardStats() {
        long totalUsers = userRepository.count();
        long students = userRepository.countByRole(UserRole.STUDENT);
        long owners = userRepository.countByRole(UserRole.OWNER);

        long totalBoardings = boardingRepository.count();
        long pendingReports = reportRepository.countByStatus(ReportStatus.PENDING);

        return new AdminDashboardDTO(
                totalUsers,
                students,
                owners,
                totalBoardings,
                pendingReports
        );
    }

    // =========================================================
    // USERS
    // =========================================================
    @Override
    public List<AdminUserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(AdminUserResponseDTO::fromEntity)
                .toList();
    }

    @Override
    public void verifyOwner(Long userId, UserVerificationDTO dto) {
        User user = findUserOrThrow(userId);

        if (user.getRole() != UserRole.OWNER) {
            throw new RuntimeException("User is not an owner");
        }

        user.setVerifiedOwner(dto.isApproved());
        userRepository.save(user);
    }

    @Override
    public AdminUserResponseDTO promoteUserToAdmin(Long userId) {
        User user = findUserOrThrow(userId);

        if (user.getRole() == UserRole.ADMIN) {
            throw new RuntimeException("User is already an admin");
        }

        user.setRole(UserRole.ADMIN);
        User savedUser = userRepository.save(user);
        return AdminUserResponseDTO.fromEntity(savedUser);
    }

    @Override
    public void deleteUser(Long userId) {
        User user = findUserOrThrow(userId);

        refreshTokenRepository.deleteByUser(user);
        reportRepository.deleteBySender_Id(userId);
        reportRepository.clearReportedUserReference(userId);
        reviewRepository.deleteByStudent_Id(userId);
        registrationRepository.deleteByStudent_Id(userId);
        appointmentRepository.deleteByStudent_Id(userId);
        maintenanceRepository.deleteByStudent_Id(userId);
        maintenanceRepository.clearAssignedTechnician(userId);
        monthlyBillRepository.deleteByStudent_Id(userId);
        technicianReviewRepository.deleteByOwner_IdOrTechnician_Id(userId, userId);
        ownerWalletTransactionRepository.deleteByOwnerId(userId);
        ownerWalletRepository.deleteByOwnerId(userId);

        deleteChatDataForUser(userId);
        deleteOwnedBoardingsAndDependencies(userId);

        userRepository.delete(user);
    }

    // =========================================================
    // BOARDINGS
    // =========================================================
    @Override
    public List<AdminBoardingResponseDTO> getAllBoardings() {
        return boardingRepository.findAll()
                .stream()
                .map(AdminBoardingResponseDTO::fromEntity)
                .toList();
    }

    @Override
    public void approveBoarding(Long boardingId) {
        Boarding boarding = findBoardingOrThrow(boardingId);

        boarding.setStatus(Status.APPROVED);
        boardingRepository.save(boarding);
    }

    @Override
    public void rejectBoarding(Long boardingId, String reason) {
        Boarding boarding = findBoardingOrThrow(boardingId);

        boarding.setStatus(Status.REJECTED);
        boardingRepository.save(boarding);
    }

    // =========================================================
    // REPORTS
    // =========================================================
    @Override
    public List<AdminReportResponseDTO> getReports(ReportStatus status) {
        List<Report> reports =
                (status == null)
                        ? reportRepository.findAll()
                        : reportRepository.findByStatus(status);

        return reports.stream()
                .map(AdminReportResponseDTO::fromEntity)
                .toList();
    }

    @Override
    public void resolveReport(Long reportId, ReportDecisionDTO dto) {
        Report report = findReportOrThrow(reportId);

        report.setStatus(ReportStatus.RESOLVED);
        report.setResolutionDetails(dto.getResolutionDetails());
        report.setActionTaken(dto.getActionTaken());
        report.setActionDuration(dto.getActionDuration());
        report.setResolvedAt(LocalDateTime.now());

        reportRepository.save(report);
    }

    @Override
    public void dismissReport(Long reportId, ReportDecisionDTO dto) {
        Report report = findReportOrThrow(reportId);

        report.setStatus(ReportStatus.DISMISSED);
        report.setDismissalReason(dto.getDismissalReason());
        report.setResolvedAt(LocalDateTime.now());

        reportRepository.save(report);
    }

    // =========================================================
    // ANALYTICS
    // =========================================================
    @Override
    public AnalyticsResponseDTO getAnalytics(String range) {
        int days = parseAnalyticsDays(range);

        LocalDate today = LocalDate.now();
        LocalDate start = today.minusDays(days - 1);
        List<String> labels = buildLabels(start, days);
        List<User> students = userRepository.findByRole(UserRole.STUDENT);
        List<Integer> studentData = countUsersByCreatedDate(students, start, today, days);

        List<Boarding> allBoardings = boardingRepository.findAll();
        List<Integer> listingData = countBoardingsByCreatedDate(allBoardings, start, today, days);
        Map<String, Integer> categoryCounts = buildBoardingCategoryCounts(allBoardings);

        List<AnalyticsResponseDTO.StatDetail> stats = buildAnalyticsStats();
        AnalyticsResponseDTO.ChartData studentTrend = buildSingleDatasetChart(labels, "Students", studentData);
        AnalyticsResponseDTO.ChartData listingTrend = buildSingleDatasetChart(labels, "Listings", listingData);
        AnalyticsResponseDTO.ChartData categoryChart = buildSingleDatasetChart(
                new ArrayList<>(categoryCounts.keySet()),
                "Categories",
                new ArrayList<>(categoryCounts.values())
        );

        return AnalyticsResponseDTO.builder()
                .stats(stats)
                .studentTrend(studentTrend)
                .listingTrend(listingTrend)
                .categoryData(categoryChart)
                .build();
    }

    private User findUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
    }

    private Boarding findBoardingOrThrow(Long boardingId) {
        return boardingRepository.findById(boardingId)
                .orElseThrow(() -> new RuntimeException("Boarding not found with ID: " + boardingId));
    }

    private Report findReportOrThrow(Long reportId) {
        return reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found with ID: " + reportId));
    }

    // Delete all chat records tied to a user before deleting the user row.
    private void deleteChatDataForUser(Long userId) {
        List<Long> roomIds = chatRoomRepository.findRoomIdsByParticipantId(userId);
        if (!roomIds.isEmpty()) {
            chatMessageRepository.deleteByChatRoomIds(roomIds);
        }

        chatMessageRepository.deleteBySender_Id(userId);
        chatRoomRepository.deleteByStudent_IdOrOwner_Id(userId, userId);
    }

    // Remove boardings owned by a user and dependent rows in child tables.
    private void deleteOwnedBoardingsAndDependencies(Long userId) {
        List<Long> ownedBoardingIds = boardingRepository.findByOwner_Id(userId)
                .stream()
                .map(Boarding::getId)
                .toList();

        if (ownedBoardingIds.isEmpty()) {
            return;
        }

        reviewRepository.deleteByBoarding_IdIn(ownedBoardingIds);
        registrationRepository.deleteByBoarding_IdIn(ownedBoardingIds);
        appointmentRepository.deleteByBoarding_IdIn(ownedBoardingIds);
        maintenanceRepository.deleteByBoarding_IdIn(ownedBoardingIds);
        monthlyBillRepository.deleteByBoarding_IdIn(ownedBoardingIds);
        boardingRepository.deleteByOwner_Id(userId);
    }

    private int parseAnalyticsDays(String range) {
        if (range == null || !range.endsWith("d")) {
            return DEFAULT_ANALYTICS_DAYS;
        }

        try {
            int parsed = Integer.parseInt(range.replace("d", ""));
            return parsed > 0 ? parsed : DEFAULT_ANALYTICS_DAYS;
        } catch (NumberFormatException ignored) {
            return DEFAULT_ANALYTICS_DAYS;
        }
    }

    private List<String> buildLabels(LocalDate start, int days) {
        List<String> labels = new ArrayList<>(days);
        for (int i = 0; i < days; i++) {
            labels.add(start.plusDays(i).format(ANALYTICS_LABEL_FORMATTER));
        }
        return labels;
    }

    private List<Integer> countUsersByCreatedDate(List<User> entities, LocalDate start, LocalDate end, int days) {
        List<Integer> counts = new ArrayList<>(Collections.nCopies(days, 0));
        for (User entity : entities) {
            if (entity.getCreatedAt() == null) {
                continue;
            }

            LocalDate createdDate = entity.getCreatedAt().toLocalDate();
            if (createdDate.isBefore(start) || createdDate.isAfter(end)) {
                continue;
            }

            int index = (int) ChronoUnit.DAYS.between(start, createdDate);
            counts.set(index, counts.get(index) + 1);
        }
        return counts;
    }

    private List<Integer> countBoardingsByCreatedDate(List<Boarding> entities, LocalDate start, LocalDate end, int days) {
        List<Integer> counts = new ArrayList<>(Collections.nCopies(days, 0));
        for (Boarding entity : entities) {
            if (entity.getCreatedAt() == null) {
                continue;
            }

            LocalDate createdDate = entity.getCreatedAt().toLocalDate();
            if (createdDate.isBefore(start) || createdDate.isAfter(end)) {
                continue;
            }

            int index = (int) ChronoUnit.DAYS.between(start, createdDate);
            counts.set(index, counts.get(index) + 1);
        }
        return counts;
    }

    private Map<String, Integer> buildBoardingCategoryCounts(List<Boarding> boardings) {
        Map<String, Integer> counts = new HashMap<>();
        for (Boarding boarding : boardings) {
            String key = boarding.getBoardingType() == null ? "UNKNOWN" : boarding.getBoardingType().name();
            counts.put(key, counts.getOrDefault(key, 0) + 1);
        }
        return counts;
    }

    private List<AnalyticsResponseDTO.StatDetail> buildAnalyticsStats() {
        List<AnalyticsResponseDTO.StatDetail> stats = new ArrayList<>();
        stats.add(buildStat("Total Users", String.valueOf(userRepository.count()), "users"));
        stats.add(buildStat("Students", String.valueOf(userRepository.countByRole(UserRole.STUDENT)), "graduation-cap"));
        stats.add(buildStat("Total Listings", String.valueOf(boardingRepository.count()), "home"));
        stats.add(buildStat("Pending Reports", String.valueOf(reportRepository.countByStatus(ReportStatus.PENDING)), "exclamation"));
        return stats;
    }

    private AnalyticsResponseDTO.StatDetail buildStat(String label, String value, String icon) {
        return AnalyticsResponseDTO.StatDetail.builder()
                .label(label)
                .value(value)
                .change("0")
                .increase(false)
                .icon(icon)
                .build();
    }

    private AnalyticsResponseDTO.ChartData buildSingleDatasetChart(List<String> labels, String datasetLabel, List<Integer> values) {
        return AnalyticsResponseDTO.ChartData.builder()
                .labels(labels)
                .datasets(Collections.singletonList(
                        AnalyticsResponseDTO.Dataset.builder()
                                .label(datasetLabel)
                                .data(values)
                                .build()
                ))
                .build();
    }
}

