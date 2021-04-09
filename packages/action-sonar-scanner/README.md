# Sonar Scanner docker action

This action sonar scanner to projects with NodeJS.

## Example usage

```yaml
uses: reigncl/reign-utils/packages/action-sonar-scanner@main
env:
  SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
  SONAR_LOGIN: ${{ secrets.SONAR_LOGIN }}
```
