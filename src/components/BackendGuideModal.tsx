import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Server,
  Database,
  FileCode,
  Terminal,
  ExternalLink,
  BookOpen,
  Send,
  Layers,
  FolderTree,
} from 'lucide-react';

interface BackendGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiUrl: string;
}

export const BackendGuideModal: React.FC<BackendGuideModalProps> = ({ isOpen, onClose, apiUrl }) => {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'structure' | 'pom' | 'properties' | 'controller' | 'entity' | 'service' | 'postman'>('quickstart');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold">
                  Java Spring Boot + MySQL Backend
                </h2>
                <p className="text-xs text-slate-400">
                  Engineering College Mini Project Architecture • Runnable on <code className="text-indigo-300 font-mono">http://localhost:8080</code>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 flex overflow-x-auto gap-2 py-2.5">
            {[
              { id: 'quickstart', label: '1. Quickstart & MySQL', icon: Terminal },
              { id: 'structure', label: '2. Folder Structure', icon: FolderTree },
              { id: 'pom', label: '3. pom.xml', icon: FileCode },
              { id: 'properties', label: '4. application.properties', icon: Database },
              { id: 'controller', label: '5. ItemController.java', icon: Layers },
              { id: 'entity', label: '6. Item.java Entity', icon: FileCode },
              { id: 'service', label: '7. ItemService.java', icon: FileCode },
              { id: 'postman', label: '8. Postman Testing Guide', icon: Send },
            ].map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Area */}
          <div className="p-6 overflow-y-auto flex-1 bg-slate-50 space-y-6 text-slate-800 text-sm">
            {/* Quickstart Tab */}
            {activeTab === 'quickstart' && (
              <div className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-indigo-950">
                  <h4 className="font-bold flex items-center space-x-2 text-indigo-900 mb-1">
                    <BookOpen className="w-4 h-4" />
                    <span>College Mini Project Setup Guide</span>
                  </h4>
                  <p className="text-xs text-indigo-800">
                    This backend is built with <strong>Java 21</strong>, <strong>Spring Boot 3.5.x</strong>, <strong>Spring Data JPA</strong>, <strong>Hibernate</strong>, and <strong>MySQL 8.x</strong>.
                    Follow these 4 simple steps to run it locally on your machine.
                  </p>
                </div>

                {/* Step 1: MySQL Setup */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center justify-between">
                    <span>Step 1: Create MySQL Database</span>
                    <button
                      onClick={() => copyToClipboard('CREATE DATABASE campusfind_db;\nUSE campusfind_db;', 'sql')}
                      className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedKey === 'sql' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'sql' ? 'Copied' : 'Copy SQL'}</span>
                    </button>
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    Log into MySQL via MySQL Workbench or command line and run:
                  </p>
                  <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl text-xs font-mono overflow-x-auto">
                    CREATE DATABASE campusfind_db;{'\n'}USE campusfind_db;
                  </pre>
                </div>

                {/* Step 2: Environment Variables */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center justify-between">
                    <span>Step 2: Set DB_PASSWORD in Windows PowerShell / Bash</span>
                    <button
                      onClick={() => copyToClipboard('$env:DB_PASSWORD="your_mysql_password"', 'pwsh')}
                      className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedKey === 'pwsh' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'pwsh' ? 'Copied' : 'Copy Command'}</span>
                    </button>
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    To keep database credentials secure without hardcoding, set the environment variable before running Maven:
                  </p>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase">Windows PowerShell:</span>
                      <pre className="bg-slate-900 text-amber-400 p-2.5 rounded-xl text-xs font-mono overflow-x-auto">
                        $env:DB_PASSWORD="your_mysql_password"
                      </pre>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase">Linux / macOS / Bash:</span>
                      <pre className="bg-slate-900 text-blue-300 p-2.5 rounded-xl text-xs font-mono overflow-x-auto">
                        export DB_PASSWORD="your_mysql_password"
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Step 3: Run Spring Boot */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center justify-between">
                    <span>Step 3: Run Spring Boot with Maven</span>
                    <button
                      onClick={() => copyToClipboard('cd backend\nmvn clean spring-boot:run', 'mvn')}
                      className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedKey === 'mvn' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'mvn' ? 'Copied' : 'Copy Command'}</span>
                    </button>
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    Navigate to the backend project folder and run:
                  </p>
                  <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl text-xs font-mono overflow-x-auto">
                    cd backend{'\n'}mvn clean spring-boot:run
                  </pre>
                  <p className="text-xs text-slate-500 mt-2">
                    The backend will start on <strong className="text-slate-700">http://localhost:8080</strong> and automatically create tables via Hibernate!
                  </p>
                </div>

                {/* Step 4: React frontend connection */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                  <h3 className="font-bold text-slate-900 mb-2">
                    Step 4: Connect React Frontend
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The React frontend is pre-configured to look for <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">http://localhost:8080/api</code>.
                    Once you start the backend, click <strong>"Check Backend (8080)"</strong> in the top banner. The app will immediately switch to live MySQL mode!
                  </p>
                </div>
              </div>
            )}

            {/* Folder Structure Tab */}
            {activeTab === 'structure' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">Project Directory Layout</h3>
                <p className="text-xs text-slate-500">
                  Standard Maven + Spring Boot directory architecture under base package <code className="text-indigo-600 font-mono">com.campusfind</code>:
                </p>
                <pre className="bg-slate-900 text-slate-200 p-4 rounded-2xl text-xs font-mono leading-relaxed overflow-x-auto">
{`backend/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/
    │   │   └── com/
    │   │       └── campusfind/
    │   │           ├── CampusFindApplication.java
    │   │           ├── config/
    │   │           │   ├── CorsConfig.java
    │   │           │   └── WebConfig.java
    │   │           ├── controller/
    │   │           │   └── ItemController.java
    │   │           ├── dto/
    │   │           │   ├── ItemRequest.java
    │   │           │   └── ItemResponse.java
    │   │           ├── entity/
    │   │           │   ├── Item.java
    │   │           │   ├── ItemType.java
    │   │           │   ├── ItemCategory.java
    │   │           │   └── ItemStatus.java
    │   │           ├── exception/
    │   │           │   ├── ErrorResponse.java
    │   │           │   ├── GlobalExceptionHandler.java
    │   │           │   └── ResourceNotFoundException.java
    │   │           ├── repository/
    │   │           │   └── ItemRepository.java
    │   │           └── service/
    │   │               └── ItemService.java
    │   └── resources/
    │       ├── application.properties
    │       └── schema.sql
    └── test/
        └── java/
            └── com/
                └── campusfind/
                    ├── CampusFindApplicationTests.java
                    └── service/
                        └── ItemServiceTest.java`}
                </pre>
              </div>
            )}

            {/* pom.xml Tab */}
            {activeTab === 'pom' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">pom.xml (Spring Boot 3.5.x, Java 21)</h3>
                  <button
                    onClick={() => copyToClipboard(POM_XML_CONTENT, 'pom')}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedKey === 'pom' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'pom' ? 'Copied' : 'Copy pom.xml'}</span>
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-[500px]">
                  {POM_XML_CONTENT}
                </pre>
              </div>
            )}

            {/* application.properties Tab */}
            {activeTab === 'properties' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">src/main/resources/application.properties</h3>
                  <button
                    onClick={() => copyToClipboard(APPLICATION_PROPERTIES_CONTENT, 'prop')}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedKey === 'prop' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'prop' ? 'Copied' : 'Copy Content'}</span>
                  </button>
                </div>
                <pre className="bg-slate-900 text-amber-300 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-[500px]">
                  {APPLICATION_PROPERTIES_CONTENT}
                </pre>
              </div>
            )}

            {/* Controller Tab */}
            {activeTab === 'controller' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">ItemController.java (@RestController)</h3>
                  <button
                    onClick={() => copyToClipboard(ITEM_CONTROLLER_CONTENT, 'ctrl')}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedKey === 'ctrl' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'ctrl' ? 'Copied' : 'Copy Controller'}</span>
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-[500px]">
                  {ITEM_CONTROLLER_CONTENT}
                </pre>
              </div>
            )}

            {/* Entity Tab */}
            {activeTab === 'entity' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">Item.java (@Entity JPA)</h3>
                  <button
                    onClick={() => copyToClipboard(ITEM_ENTITY_CONTENT, 'ent')}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedKey === 'ent' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'ent' ? 'Copied' : 'Copy Entity'}</span>
                  </button>
                </div>
                <pre className="bg-slate-900 text-emerald-300 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-[500px]">
                  {ITEM_ENTITY_CONTENT}
                </pre>
              </div>
            )}

            {/* Service Tab */}
            {activeTab === 'service' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">ItemService.java (@Service)</h3>
                  <button
                    onClick={() => copyToClipboard(ITEM_SERVICE_CONTENT, 'srv')}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedKey === 'srv' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'srv' ? 'Copied' : 'Copy Service'}</span>
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-[500px]">
                  {ITEM_SERVICE_CONTENT}
                </pre>
              </div>
            )}

            {/* Postman Guide Tab */}
            {activeTab === 'postman' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">Postman Testing & API Endpoints</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold mr-2">GET</span>
                    <code className="text-xs font-mono text-slate-800">http://localhost:8080/api/items?search=calculator&page=0&size=10</code>
                    <p className="text-xs text-slate-500 mt-1">Fetch paginated list with optional search, type, category, and status filters.</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold mr-2">GET</span>
                    <code className="text-xs font-mono text-slate-800">http://localhost:8080/api/items/1</code>
                    <p className="text-xs text-slate-500 mt-1">Fetch single report by ID. Returns 404 if not found.</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold mr-2">POST</span>
                    <code className="text-xs font-mono text-slate-800">http://localhost:8080/api/items</code>
                    <p className="text-xs text-slate-500 mt-1">
                      Body: <code className="font-mono">form-data</code> with key <code className="font-mono">item</code> (Text: JSON) and optional key <code className="font-mono">image</code> (File).
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold mr-2">PUT</span>
                    <code className="text-xs font-mono text-slate-800">http://localhost:8080/api/items/1</code>
                    <p className="text-xs text-slate-500 mt-1">Update item fields and optional replacement photo.</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold mr-2">PATCH</span>
                    <code className="text-xs font-mono text-slate-800">http://localhost:8080/api/items/1/resolve</code>
                    <p className="text-xs text-slate-500 mt-1">Marks status as RESOLVED.</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold mr-2">DELETE</span>
                    <code className="text-xs font-mono text-slate-800">http://localhost:8080/api/items/1</code>
                    <p className="text-xs text-slate-500 mt-1">Deletes item and safely purges associated image. Returns 204 No Content.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Files are saved in <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-700">/backend/</code> directory.
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition cursor-pointer"
            >
              Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Snippets for quick code view
const POM_XML_CONTENT = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.5.0</version>
        <relativePath/>
    </parent>
    <groupId>com.campusfind</groupId>
    <artifactId>campusfind-backend</artifactId>
    <version>1.0.0</version>
    <name>campusfind-backend</name>
    <description>CampusFind Lost and Found Portal REST API</description>

    <properties>
        <java.version>21</java.version>
    </properties>

    <dependencies>
        <!-- Spring Web for RESTful APIs -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA & Hibernate -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- MySQL Connector/J -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Jakarta Bean Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Spring Boot Test & JUnit 5 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`;

const APPLICATION_PROPERTIES_CONTENT = `# ===============================================
# CampusFind Spring Boot Backend Configuration
# ===============================================
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/campusfind_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=\${DB_PASSWORD:}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate & JPA Properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Multipart File Upload Settings (Max 5MB per file)
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=6MB

# Local File Storage Configuration
file.upload-dir=./uploads/images
`;

const ITEM_CONTROLLER_CONTENT = `package com.campusfind.controller;

import com.campusfind.dto.ItemRequest;
import com.campusfind.dto.ItemResponse;
import com.campusfind.entity.ItemCategory;
import com.campusfind.entity.ItemStatus;
import com.campusfind.entity.ItemType;
import com.campusfind.service.ItemService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {
    RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
    RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS
})
public class ItemController {

    private final ItemService itemService;
    private final ObjectMapper objectMapper;

    public ItemController(ItemService itemService, ObjectMapper objectMapper) {
        this.itemService = itemService;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public ResponseEntity<Page<ItemResponse>> getAllItems(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ItemType type,
            @RequestParam(required = false) ItemCategory category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) ItemStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<ItemResponse> items = itemService.getItems(search, type, category, location, status, pageable);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getItemById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ItemResponse> createItem(
            @RequestPart("item") String itemJson,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {

        ItemRequest request = objectMapper.readValue(itemJson, ItemRequest.class);
        ItemResponse created = itemService.createItem(request, image);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ItemResponse> updateItem(
            @PathVariable Long id,
            @RequestPart("item") String itemJson,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {

        ItemRequest request = objectMapper.readValue(itemJson, ItemRequest.class);
        ItemResponse updated = itemService.updateItem(id, request, image);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<ItemResponse> resolveItem(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.resolveItem(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
`;

const ITEM_ENTITY_CONTENT = `package com.campusfind.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Item name is required")
    @Size(max = 150, message = "Item name cannot exceed 150 characters")
    @Column(name = "item_name", nullable = false, length = 150)
    private String itemName;

    @NotBlank(message = "Description is required")
    @Lob
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Item type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private ItemType type;

    @NotNull(message = "Category is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 50)
    private ItemCategory category;

    @NotBlank(message = "Location is required")
    @Column(name = "location", nullable = false, length = 150)
    private String location;

    @NotNull(message = "Incident date is required")
    @Column(name = "incident_date", nullable = false)
    private LocalDate incidentDate;

    @NotBlank(message = "Contact name is required")
    @Column(name = "contact_name", nullable = false, length = 100)
    private String contactName;

    @Column(name = "contact_email", length = 150)
    private String contactEmail;

    @Column(name = "contact_phone", length = 30)
    private String contactPhone;

    @Column(name = "image_url")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ItemStatus status = ItemStatus.ACTIVE;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = ItemStatus.ACTIVE;
        }
    }

    // Getters and Setters omitted for brevity, provided in full backend code
}
`;

const ITEM_SERVICE_CONTENT = `package com.campusfind.service;

import com.campusfind.dto.ItemRequest;
import com.campusfind.dto.ItemResponse;
import com.campusfind.entity.*;
import com.campusfind.exception.ResourceNotFoundException;
import com.campusfind.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
@Transactional
public class ItemService {

    private final ItemRepository itemRepository;

    @Value("\${file.upload-dir:./uploads/images}")
    private String uploadDir;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public Page<ItemResponse> getItems(String search, ItemType type, ItemCategory category,
                                      String location, ItemStatus status, Pageable pageable) {
        return itemRepository.findWithFilters(search, type, category, location, status, pageable)
                .map(this::mapToResponse);
    }

    public ItemResponse getItemById(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item report #" + id + " not found"));
        return mapToResponse(item);
    }

    public ItemResponse createItem(ItemRequest request, MultipartFile image) throws IOException {
        Item item = new Item();
        item.setItemName(request.getItemName());
        item.setDescription(request.getDescription());
        item.setType(request.getType());
        item.setCategory(request.getCategory());
        item.setLocation(request.getLocation());
        item.setIncidentDate(request.getIncidentDate());
        item.setContactName(request.getContactName());
        item.setContactEmail(request.getContactEmail());
        item.setContactPhone(request.getContactPhone());
        item.setStatus(ItemStatus.ACTIVE);

        if (image != null && !image.isEmpty()) {
            String storedPath = storeImage(image);
            item.setImageUrl(storedPath);
        }

        Item saved = itemRepository.save(item);
        return mapToResponse(saved);
    }

    public ItemResponse resolveItem(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item report #" + id + " not found"));
        item.setStatus(ItemStatus.RESOLVED);
        return mapToResponse(itemRepository.save(item));
    }

    public void deleteItem(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item report #" + id + " not found"));
        itemRepository.delete(item);
    }

    private ItemResponse mapToResponse(Item item) {
        ItemResponse r = new ItemResponse();
        r.setId(item.getId());
        r.setItemName(item.getItemName());
        r.setDescription(item.getDescription());
        r.setType(item.getType());
        r.setCategory(item.getCategory());
        r.setLocation(item.getLocation());
        r.setIncidentDate(item.getIncidentDate());
        r.setContactName(item.getContactName());
        r.setContactEmail(item.getContactEmail());
        r.setContactPhone(item.getContactPhone());
        r.setImageUrl(item.getImageUrl());
        r.setStatus(item.getStatus());
        r.setCreatedAt(item.getCreatedAt());
        return r;
    }

    private String storeImage(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename().replaceAll("[^a-zA-Z0-9.-]", "_");
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return "/api/items/images/" + filename;
    }
}
`;
