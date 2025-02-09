// Default configuration for the speed dial
export const defaultConfig = `# Example Speed Dial Configuration
groups:
  - name: Cloud Services
    subgroups:
      - name: AWS
        sites:
          - name: AWS Console
            url: https://console.aws.amazon.com
          - name: S3 Buckets
            url: https://s3.console.aws.amazon.com
          - name: EC2 Instances
            url: https://console.aws.amazon.com/ec2
      - name: GCP
        sites:
          - name: Cloud Console
            url: https://console.cloud.google.com
          - name: Cloud Storage
            url: https://console.cloud.google.com/storage

  - name: Local Development
    sites:
      - name: Localhost
        url: http://localhost:3000
      - name: PHPMyAdmin
        url: http://localhost:8080
      - name: MongoDB Express
        url: http://localhost:8081

  - name: Documentation
    sites:
      - name: DevDocs
        url: https://devdocs.io
      - name: MDN Web Docs
        url: https://developer.mozilla.org
    subgroups:
      - name: API References
        sites:
          - name: OpenAPI
            url: https://swagger.io/specification
          - name: REST API Guidelines
            url: https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md`;