package com.example.demo.config;

import com.example.demo.entity.DocumentSequence;
import com.example.demo.repository.DocumentSequenceRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;

// DocumentNumberService는 PRD·INV·EMP 행이 없으면 번호를 만들지 못하므로(503),
// 서버 시작 시 빠진 행만 만듭니다. 이미 있는 행은 건드리지 않습니다.
// 기존 데이터가 있으면 가장 큰 번호부터 이어서 발급되도록 시작값을 맞춥니다.
@Component
@RequiredArgsConstructor
public class DocumentSequenceInitializer implements ApplicationRunner {
  private static final Logger log = LoggerFactory.getLogger(DocumentSequenceInitializer.class);
  private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");

  private final DocumentSequenceRepository sequenceRepository;
  private final EntityManager entityManager;

  @Override
  @Transactional
  public void run(ApplicationArguments args) {
    int year = LocalDate.now(ZONE).getYear();

    // PRD는 잠금용 행, 실제 번호는 연도별 행(PRD-연도)에서 이어짐
    create("PRD", 0L);
    create("PRD-" + year, lastNumber(
      "select max(o.id) from ProductionOrder o where o.id like :pattern",
      "PRD-" + year + "-___"
    ));
    create("INV", lastNumber(
      "select max(i.id) from InventoryItem i where i.id like :pattern",
      "INV-____"
    ));
    create("EMP", lastNumber(
      "select max(e.id) from Employee e where e.id like :pattern",
      "EMP-____"
    ));
  }

  private void create(String key, long lastValue) {
    if (sequenceRepository.existsById(key))
      return;

    sequenceRepository.save(new DocumentSequence(key, lastValue));
    log.info("번호 행을 만들었습니다. ({} 시작값: {})", key, lastValue);
  }

  // 자릿수가 고정된 번호라 문자열 max가 곧 가장 큰 번호 (예: INV-0012 → 12)
  private long lastNumber(String jpql, String pattern) {
    String maxId = entityManager.createQuery(jpql, String.class)
      .setParameter("pattern", pattern)
      .getSingleResult();

    if (maxId == null)
      return 0L;

    String number = maxId.substring(maxId.lastIndexOf('-') + 1);
    return number.chars().allMatch(Character::isDigit) ? Long.parseLong(number) : 0L;
  }
}
